function patch (oldVnode, vnode) {
  if(isUndef(vnode)){
      return
  }
  if (oldVnode === vnode) {
      return 
  }
  
  if(sameVnode(oldVnode, vnode)){
        patchVnode(oldVnode, vnode)
  }else{
      const parentElm = oldVnode.elm.parentNode;
      createElm(vnode,parentElm,oldVnode.elm)
      removeVnodes(parentElm,[oldVnode],0,0)
  }
}
function sameVnode (a, b) {
  return (
      a.key === b.key && 
      a.tagName=== b.tagName &&
      sameInputType(a, b)
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') return true
  return a.props.type == b.props.type
}
function patchVnode(oldVnode, vnode){
  var ch = vnode.children
  var oldCh = oldVnode.children
  
  if(isUndef(vnode.text)){
    if(isDef(ch) && isDef(oldCh)){
        updateChildren(oldVnode.elm,oldCh,ch)
    }else if(isDef(ch)){
        if (isDef(oldVnode.text)) setTextContent(oldVnode.elm, '')
        addVnodes(oldVnode, ch, 0, ch.length - 1)
    }else if(isDef(oldCh)){
        removeVnodes(oldVnode.elm, oldCh, 0, oldCh.length - 1)
    }
  }else{
      setTextContent(oldVnode.elm,vnode.text);
  }
}
function updateChildren(parentElm, oldCh, newCh,){
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx, idxInOld, vnodeToMove, refElm

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] 
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { 
        patchVnode(oldStartVnode, newEndVnode)
        insertBefore(parentElm, oldStartVnode.elm, oldEndVnode.elm.nextSibling)
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { 
        patchVnode(oldEndVnode, newStartVnode)
        insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        if (isUndef(idxInOld)) {
          createElm(newStartVnode, parentElm, oldStartVnode.elm)
        } else {
          vnodeToMove = oldCh[idxInOld]
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode)
            oldCh[idxInOld] = undefined
            insertBefore(parentElm,vnodeToMove.elm, oldStartVnode.elm)
          } else {
            createElm(newStartVnode, parentElm, oldStartVnode.elm)
          }
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
    
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, newCh, newStartIdx, newEndIdx)
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  let i, key
  const map = {}
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key
    if (isDef(key)) map[key] = i
  }
  return map
}
function findIdxInOld (node, oldCh, start, end) {
  for (let i = start; i < end; i++) {
    const c = oldCh[i]
    if (isDef(c) && sameVnode(node, c)) return i
  }
}
function setTextContent(elm, content){
  elm.textContent = content;
}
function addVnodes (parentElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    createElm(vnodes[startIdx], parentElm, null)
  }
}
function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
  for (let i=startIdx; i <= endIdx; i++) {
    var ch = vnodes[i]
    if(ch){
      parentElm.removeChild(vnodes[i].elm)
    }
  }
}

function createElm (vnode, parentElm, afterElm) {
  let element = vnode.render()
  vnode.elm = element;
  if(isDef(afterElm)){
    insertBefore(parentElm,element,afterElm)
  }else{
    parentElm.appendChild(element)
  }
  return element;
}
function insertBefore(parentElm,element,afterElm){
  parentElm.insertBefore(element,afterElm)
}

function isDef (v) {
  return v !== undefined && v !== null && v != []
}

function isUndef(v){
  return v === undefined || v === null || v === ''
}