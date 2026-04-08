// Shared types for API responses
export interface CarbonScoreData {
  totalEmission: number
  score: number
  grade: string
  electricityEmission: number
  transportEmission: number
  gasEmission: number
  waterEmission: number
  otherEmission: number
  previousMonthChange?: number | null
  nationalAverage?: number | null
  month: string
}

export interface CarbonScoresResponse {
  score?: CarbonScoreData
  scores?: CarbonScoreData[]
  summary?: {
    totalEmission: number
    averageScore: number
    currentMonth: CarbonScoreData | null
    monthsTracked: number
  }
}

export interface BillData {
  id: string
  type: string
  amount: number
  units?: number | null
  unitType?: string | null
  carbonEmission: number
  date: string
  month: string
  receiptUrl?: string | null
  notes?: string | null
  entryMethod: string
}

export interface BillsResponse {
  bills?: BillData[]
  bill?: BillData
}

export interface BudgetData {
  id: string
  month: string
  targetEmission: number
  currentEmission: number
  electricityBudget?: number | null
  transportBudget?: number | null
  gasBudget?: number | null
}

export interface BudgetResponse {
  budget?: BudgetData
}

export interface RecommendationData {
  id: string
  title: string
  description: string
  category: string
  impact: string
  potentialSaving: number
  difficulty: string
}

export interface RecommendationsResponse {
  recommendations?: RecommendationData[]
  userTopEmissionCategory?: string | null
}

export interface ChallengeData {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  targetReduction: number
  duration: number
  points: number
  icon?: string | null
  userChallenge?: {
    status: string
    progress: number
    carbonSaved: number
    startDate: string
    endDate: string
  } | null
}

export interface ChallengesResponse {
  challenges?: ChallengeData[]
  stats?: {
    active: number
    completed: number
    totalPoints: number
    totalCarbonSaved: number
  }
}

// API helper for making authenticated requests

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    const headers: HeadersInit = {
      ...options.headers,
    }

    // Only set Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      return { data: null, error: data.error || 'Request failed' }
    }

    return { data, error: null }
  } catch {
    return { data: null, error: 'Network error' }
  }
}

// Auth helpers
export function getUser() {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export function isAuthenticated() {
  return !!getToken()
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

// API endpoints
export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, name?: string) =>
    apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  logout: () => apiRequest('/api/auth/logout', { method: 'POST' }),

  getMe: () => apiRequest('/api/auth/me'),

  // Bills
  getBills: (params?: { month?: string; type?: string; limit?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.month) searchParams.set('month', params.month)
    if (params?.type) searchParams.set('type', params.type)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    return apiRequest<BillsResponse>(`/api/bills?${searchParams}`)
  },

  createBill: (data: {
    type: string
    amount?: number
    units: number
    date: string
    notes?: string
    entryMethod?: 'scanner' | 'manual'
  }) =>
    apiRequest<BillsResponse>('/api/bills', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  uploadBill: (formData: FormData) =>
    apiRequest<BillsResponse>('/api/bills/upload', {
      method: 'POST',
      body: formData,
    }),

  deleteBill: (id: string) =>
    apiRequest<{ message: string }>(`/api/bills/${id}`, { method: 'DELETE' }),

  // Carbon Score
  getCarbonScores: (params?: { month?: string; limit?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.month) searchParams.set('month', params.month)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    return apiRequest<CarbonScoresResponse>(`/api/carbon/score?${searchParams}`)
  },

  // Carbon Budget
  getCarbonBudget: (month?: string) => {
    const searchParams = month ? `?month=${month}` : ''
    return apiRequest<BudgetResponse>(`/api/carbon/budget${searchParams}`)
  },

  setCarbonBudget: (data: {
    month: string
    targetEmission: number
    electricityBudget?: number
    transportBudget?: number
    gasBudget?: number
  }) =>
    apiRequest<BudgetResponse>('/api/carbon/budget', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Challenges
  getChallenges: (includeProgress?: boolean) => {
    const searchParams = includeProgress ? '?progress=true' : ''
    return apiRequest<ChallengesResponse>(`/api/challenges${searchParams}`)
  },

  getMyChallenges: (status?: string) => {
    const searchParams = status ? `?status=${status}` : ''
    return apiRequest<ChallengesResponse>(`/api/challenges/my${searchParams}`)
  },

  joinChallenge: (challengeId: string) =>
    apiRequest<{ message: string }>('/api/challenges', {
      method: 'POST',
      body: JSON.stringify({ challengeId }),
    }),

  updateChallengeProgress: (
    challengeId: string,
    data: { progress?: number; carbonSaved?: number; status?: string }
  ) =>
    apiRequest<{ message: string }>(`/api/challenges/${challengeId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  leaveChallenge: (challengeId: string) =>
    apiRequest<{ message: string }>(`/api/challenges/${challengeId}`, { method: 'DELETE' }),

  // Recommendations
  getRecommendations: (params?: { category?: string; impact?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set('category', params.category)
    if (params?.impact) searchParams.set('impact', params.impact)
    return apiRequest<RecommendationsResponse>(`/api/recommendations?${searchParams}`)
  },
}
