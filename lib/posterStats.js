// Menghitung statistik keluarga dari data persons
export function calculateFamilyStats(persons) {
  if (!persons || persons.length === 0) {
    return {
      total: 0,
      generations: 0,
      oldest: null,
      youngest: null,
      yearRange: null,
      maleCount: 0,
      femaleCount: 0,
      aliveCount: 0,
      deceasedCount: 0,
    }
  }

  // Hitung generasi berdasarkan father_id/mother_id
  const childrenMap = {}
  persons.forEach(p => {
    [p.father_id, p.mother_id].filter(Boolean).forEach(pid => {
      if (!childrenMap[pid]) childrenMap[pid] = []
      childrenMap[pid].push(p.id)
    })
  })

  // Root: yang tidak punya parent di list
  const ids = new Set(persons.map(p => p.id))
  const roots = persons.filter(p =>
    (!p.father_id || !ids.has(p.father_id)) &&
    (!p.mother_id || !ids.has(p.mother_id))
  )

  // Topological level assignment — level = 1 + max(parent levels)
  const level = {}
  roots.forEach(r => { level[r.id] = 1 })
  let changed = true, iter = 0
  const maxIter = persons.length + 5
  while (changed && iter < maxIter) {
    changed = false; iter++
    persons.forEach(p => {
      const parents = [p.father_id, p.mother_id].filter(pid => pid && ids.has(pid))
      if (parents.length === 0) {
        if (level[p.id] === undefined) { level[p.id] = 1; changed = true }
        return
      }
      const pls = parents.map(pid => level[pid]).filter(l => l !== undefined)
      if (pls.length === 0) return
      const nl = Math.max(...pls) + 1
      if (level[p.id] === undefined || level[p.id] < nl) {
        level[p.id] = nl; changed = true
      }
    })
  }
  const maxGen = Math.max(1, ...Object.values(level))

  // Tertua & termuda berdasarkan tahun lahir
  const withYear = persons.filter(p => p.birth_year)
  const sorted = [...withYear].sort((a, b) => a.birth_year - b.birth_year)
  const oldest = sorted[0] || null
  const youngest = sorted[sorted.length - 1] || null

  const yearRange = withYear.length > 0
    ? `${oldest.birth_year} – ${youngest.birth_year}`
    : null

  // Breakdown
  const maleCount = persons.filter(p => p.gender === 'male').length
  const femaleCount = persons.filter(p => p.gender === 'female').length
  const deceasedCount = persons.filter(p => p.death_year).length
  const aliveCount = persons.length - deceasedCount

  return {
    total: persons.length,
    generations: maxGen,
    oldest,
    youngest,
    yearRange,
    maleCount,
    femaleCount,
    aliveCount,
    deceasedCount,
  }
}
