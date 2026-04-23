/**
 * getMahram — hitung mahram seseorang berdasarkan 3 jalur:
 *
 * 1. NASAB      — keturunan darah (leluhur, keturunan, saudara, paman/bibi, keponakan)
 * 2. MUSHAHARAH — pernikahan (mertua, menantu, ibu tiri/ayah tiri, anak tiri)
 * 3. RADHA'AH   — persusuan (saudara sepersusuan + kerabat ibu susu)
 */
export function getMahram(pid, persons, marriages = [], radhaRelations = []) {
  const map = {}
  persons.forEach(p => map[p.id] = p)

  const getParents = id => [map[id]?.father_id, map[id]?.mother_id].filter(x => x && map[x])
  const getChildren = id => persons.filter(p => p.father_id === id || p.mother_id === id).map(p => p.id)

  const getSpouses = id => {
    const s = new Set()
    marriages.forEach(m => {
      if (m.status !== 'active') return
      if (m.person1_id === id && map[m.person2_id]) s.add(m.person2_id)
      if (m.person2_id === id && map[m.person1_id]) s.add(m.person1_id)
    })
    persons.forEach(p => {
      if (p.father_id === id && p.mother_id && map[p.mother_id]) s.add(p.mother_id)
      if (p.mother_id === id && p.father_id && map[p.father_id]) s.add(p.father_id)
    })
    return [...s]
  }

  // ── NASAB ──
  const ancestors = new Set()
  const addAncestors = id => getParents(id).forEach(x => { if (!ancestors.has(x)) { ancestors.add(x); addAncestors(x) } })
  addAncestors(pid)

  const descendants = new Set()
  const addDescendants = id => getChildren(id).forEach(x => { if (!descendants.has(x)) { descendants.add(x); addDescendants(x) } })
  addDescendants(pid)

  const myParents = getParents(pid)
  const siblings = new Set(persons.filter(p => p.id !== pid && myParents.some(x => p.father_id === x || p.mother_id === x)).map(p => p.id))

  const unclesAunts = new Set()
  myParents.forEach(x => {
    const gps = getParents(x)
    persons.filter(p => p.id !== x && gps.some(g => p.father_id === g || p.mother_id === g)).forEach(p => unclesAunts.add(p.id))
  })

  const niecesNephews = new Set()
  siblings.forEach(s => getChildren(s).forEach(x => niecesNephews.add(x)))

  const nasab = new Set([...ancestors, ...descendants, ...siblings, ...unclesAunts, ...niecesNephews])

  // ── MUSHAHARAH ──
  const mushaharah = new Set()
  const mySpouses = getSpouses(pid)

  // Mertua & leluhur mertua ke atas
  mySpouses.forEach(spouseId => {
    const addSpouseAncestors = id => getParents(id).forEach(x => { if (!mushaharah.has(x)) { mushaharah.add(x); addSpouseAncestors(x) } })
    addSpouseAncestors(spouseId)
  })

  // Menantu (pasangan dari anak)
  descendants.forEach(childId => { getSpouses(childId).forEach(inlaw => mushaharah.add(inlaw)) })

  // Anak tiri (anak kandung pasangan dari orang lain)
  mySpouses.forEach(spouseId => { getChildren(spouseId).forEach(stepChild => { if (!descendants.has(stepChild)) mushaharah.add(stepChild) }) })

  // Ibu tiri / ayah tiri (pasangan dari orang tua)
  myParents.forEach(parentId => { getSpouses(parentId).forEach(stepParent => { if (stepParent !== pid) mushaharah.add(stepParent) }) })

  mushaharah.delete(pid)
  nasab.forEach(id => mushaharah.delete(id))

  // ── RADHA'AH ──
  const radha = new Set()
  const radhaSiblings = new Set()
  radhaRelations.forEach(r => {
    if (r.person1_id === pid && map[r.person2_id]) radhaSiblings.add(r.person2_id)
    if (r.person2_id === pid && map[r.person1_id]) radhaSiblings.add(r.person1_id)
  })

  radhaSiblings.forEach(id => {
    radha.add(id)
    getChildren(id).forEach(child => radha.add(child))
    getParents(id).forEach(p => radha.add(p))
  })

  radha.delete(pid)
  nasab.forEach(id => radha.delete(id))
  mushaharah.forEach(id => radha.delete(id))

  // ── GABUNGAN ──
  const all = new Set([...nasab, ...mushaharah, ...radha])
  all.delete(pid)

  return { nasab, mushaharah, radha, all }
}

export function getGeneration(id, map, cache = {}, visited = new Set()) {
  if (id in cache) return cache[id]
  if (visited.has(id)) return 0
  visited.add(id)
  const p = map[id]
  if (!p) return cache[id] = 0
  const pg = [p.father_id, p.mother_id].filter(x => x && map[x]).map(x => getGeneration(x, map, cache, new Set(visited)))
  return cache[id] = pg.length ? Math.max(...pg) + 1 : 0
}

export function computeGenerations(persons) {
  const map = {}
  persons.forEach(p => map[p.id] = p)
  const cache = {}
  persons.forEach(p => getGeneration(p.id, map, cache))
  const couples = new Map()
  persons.forEach(p => {
    if (p.father_id && p.mother_id && map[p.father_id] && map[p.mother_id]) {
      const key = [p.father_id, p.mother_id].sort().join('|')
      couples.set(key, { a: p.father_id, b: p.mother_id })
    }
  })
  let changed = true, iter = 0
  while (changed && iter++ < 10) {
    changed = false
    couples.forEach(({ a, b }) => {
      const ga = cache[a] ?? 0, gb = cache[b] ?? 0
      if (ga !== gb) { const mx = Math.max(ga, gb); cache[a] = mx; cache[b] = mx; changed = true }
    })
  }
  return cache
}
