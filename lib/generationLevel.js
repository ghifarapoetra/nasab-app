// Sulalah Smart Generation Level Calculator
// Handles: nasab parent-child + pasangan (spouse via marriages OR shared children)

/**
 * Calculate generation level for all persons in a tree.
 * Returns: { [person_id]: level_number } starting at 0 (oldest)
 *
 * Algorithm (4 layers, iterative until stable):
 *   1. Person with parent_id → level = max(parent levels) + 1
 *   2. Person without parent but partnered with another (via marriages OR shared children)
 *      → level = level of that partner
 *   3. Person without parent but has children in tree
 *      → level = level of first child - 1
 *   4. Otherwise → level = 0 (true ancestor)
 *
 * @param persons - array of person objects { id, father_id, mother_id, ... }
 * @param marriages - optional array of marriage records { person1_id, person2_id, status }
 */
export function calculateGenerationLevels(persons, marriages = []) {
  if (!persons || persons.length === 0) return {}

  const ids = new Set(persons.map(p => p.id))
  const byId = {}
  persons.forEach(p => { byId[p.id] = p })

  // Build parent → children map
  const childrenMap = {}
  persons.forEach(p => {
    [p.father_id, p.mother_id].filter(pid => pid && ids.has(pid)).forEach(pid => {
      if (!childrenMap[pid]) childrenMap[pid] = []
      if (!childrenMap[pid].includes(p.id)) childrenMap[pid].push(p.id)
    })
  })

  // Build partner map from BOTH sources:
  // 1. Shared children (auto-detect)
  // 2. Marriages table (explicit)
  const partnerMap = {}
  const addPartner = (a, b) => {
    if (a === b) return
    if (!partnerMap[a]) partnerMap[a] = new Set()
    if (!partnerMap[b]) partnerMap[b] = new Set()
    partnerMap[a].add(b)
    partnerMap[b].add(a)
  }

  // From shared children
  persons.forEach(p => {
    if (p.father_id && p.mother_id && ids.has(p.father_id) && ids.has(p.mother_id)) {
      addPartner(p.father_id, p.mother_id)
    }
  })
  // From marriages table (explicit)
  if (Array.isArray(marriages)) {
    marriages.forEach(m => {
      if (m.status !== 'active' && m.status !== undefined) return
      if (m.person1_id && m.person2_id && ids.has(m.person1_id) && ids.has(m.person2_id)) {
        addPartner(m.person1_id, m.person2_id)
      }
    })
  }

  // Initialize levels
  const level = {}

  // Iterate until stable
  let changed = true
  let iterations = 0
  const maxIter = persons.length * 3 + 10

  while (changed && iterations < maxIter) {
    changed = false
    iterations++

    persons.forEach(p => {
      let newLevel = null

      // Layer 1: has parent in tree
      const parentIds = [p.father_id, p.mother_id].filter(pid => pid && ids.has(pid))
      if (parentIds.length > 0) {
        const parentLevels = parentIds.map(pid => level[pid]).filter(l => l !== undefined)
        if (parentLevels.length > 0) {
          newLevel = Math.max(...parentLevels) + 1
        }
      }

      // Layer 2: no parent, but has partner with known level (spouse)
      if (newLevel === null && parentIds.length === 0) {
        const partners = partnerMap[p.id]
        if (partners && partners.size > 0) {
          const partnerLevels = Array.from(partners)
            .map(pid => level[pid])
            .filter(l => l !== undefined)
          if (partnerLevels.length > 0) {
            newLevel = Math.max(...partnerLevels)
          }
        }
      }

      // Layer 3: no parent, no partner with known level, but has children
      if (newLevel === null && parentIds.length === 0) {
        const kids = childrenMap[p.id] || []
        if (kids.length > 0) {
          const kidLevels = kids.map(kid => level[kid]).filter(l => l !== undefined)
          if (kidLevels.length > 0) {
            newLevel = Math.min(...kidLevels) - 1
          }
        }
      }

      // Layer 4: true ancestor
      if (newLevel === null && parentIds.length === 0) {
        if (level[p.id] === undefined) {
          newLevel = 0
        }
      }

      if (newLevel !== null) {
        if (level[p.id] === undefined || (parentIds.length === 0 ? level[p.id] !== newLevel : newLevel > level[p.id])) {
          if (level[p.id] !== newLevel) {
            level[p.id] = newLevel
            changed = true
          }
        }
      }
    })
  }

  // Fallback: anything still unset → 0
  persons.forEach(p => { if (level[p.id] === undefined) level[p.id] = 0 })

  // Normalize: shift up if any level is negative
  const minLevel = Math.min(...Object.values(level))
  if (minLevel < 0) {
    Object.keys(level).forEach(id => { level[id] -= minLevel })
  }

  return level
}
