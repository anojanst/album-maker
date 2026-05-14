import type { TextLayer } from '@/types/album'

export function startInlineEdit(
  layer: TextLayer,
  node: any,
  stage: any,
  trRef: any,
  onSave: (content: string) => void,
) {
  node.hide()
  if (trRef?.current) { trRef.current.nodes([]); trRef.current.getLayer()?.batchDraw() }
  const rect = stage.container().getBoundingClientRect()
  const pos = node.getAbsolutePosition()
  const fs = node.fontSize()
  const ta = document.createElement('textarea')
  ta.value = layer.content
  ta.style.cssText = `position:fixed;top:${rect.top + pos.y}px;left:${rect.left + pos.x}px;font-size:${fs}px;font-family:'${layer.fontFamily}';color:${layer.color};background:transparent;border:none;outline:2px dashed #0C447C;outline-offset:2px;resize:none;padding:0;z-index:1000;min-width:80px;white-space:pre`
  document.body.appendChild(ta)
  ta.focus()
  ta.select()
  const finish = () => {
    const content = ta.value.trim() || layer.content
    document.body.removeChild(ta)
    node.show()
    onSave(content)
    if (trRef?.current) { trRef.current.nodes([node]); trRef.current.getLayer()?.batchDraw() }
  }
  ta.addEventListener('blur', finish, { once: true })
  ta.addEventListener('keydown', (e) => { if (e.key === 'Escape') ta.blur() })
}
