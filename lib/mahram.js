export function getMahram(pid, persons) {
  const map = {}
  persons.forEach(p => map[p.id] = p)

  const getParents = id => [map[id]?.father_id, map[id]?.mother_id].filter(x => x && map[x])
  const getChildren = id => persons.filter(p => p.father_id === id || p.mother_id === id).map(p => p.id)

  // Ancestors (orang tua ke atas)
  const ancestors = new Set()
  const addAncestors = id => getParents(id).forEach(x => { if (!ancestors.has(x)) { ancestors.add(x); addAncestors(x) } })
  addAncestors(pid)

  // Descendants (anak ke bawah)
  const descendants = new Set()
  const addDescendants = id => getChildren(id).forEach(x => { if (!descendants.has(x)) { descendants.add(x); addDescendants(x) } })
  addDescendants(pid)

  // Siblings
  const myParents = getParents(pid)
  const siblings = new Set(persons.filter(p => p.id !== pid && myParents.some(x => p.father_id === x || p.mother_id === x)).map(p => p.id))

  // Uncles & aunts (saudara orang tua)
  const unclesAunts = new Set()
  myParents.forEach(x => {
    const grandparents = getParents(x)
    persons.filter(p => p.id !== x && grandparents.some(g => p.father_id === g || p.mother_id === g)).forEach(p => unclesAunts.add(p.id))
  })

  // Nieces & nephews (anak saudara)
  const niecesNephews = new Set()
  siblings.forEach(s => getChildren(s).forEach(x => niecesNephews.add(x)))

  const all = new Set([...ancestors, ...descendants, ...siblings, ...unclesAunts, ...niecesNephews])

  return {
    ancestors: [...ancestors],
    descendants: [...descendants],
    siblings: [...siblings],
    unclesAunts: [...unclesAunts],
    niecesNephews: [...niecesNephews],
    all
  }
}

export function getGeneration(id, map, cache = {}, visited = new Set()) {
  if (id in cache) return cache[id]
  if (visited.has(id)) return 0
  visited.add(id)
  const p = map[id]
  if (!p) return cache[id] = 0
  const parentGens = [p.father_id, p.mother_id]
    .filter(x => x && map[x])
    .map(x => getGeneration(x, map, cache, new Set(visited)))
  return cache[id] = parentGens.length ? Math.max(...parentGens) + 1 : 0
}
