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

  // BFS untuk generasi
  let maxGen = 1
  const queue = roots.map(r => ({ id: r.id, gen: 1 }))
  const visited = new Set()
  while (queue.length > 0) {
    const { id, gen } = queue.shift()
    if (visited.has(id)) continue
    visited.add(id)
    maxGen = Math.max(maxGen, gen)
    const kids = childrenMap[id] || []
    kids.forEach(kid => queue.push({ id: kid, gen: gen + 1 }))
  }

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
