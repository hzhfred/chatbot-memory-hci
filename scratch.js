{msg.role === "summary" && (
<div className={msg.visible ? 'summary-children-container' : 'message-hidden-child summary-children-container'}>
<ul>
{msg.children && msg.children.map((child, index) => (
<li key={child.id} id={child.id} >
<div className={msg.cascade ? 'parent-message-wrapper child-message-expanded' : 'parent-message-wrapper child-message-retracted'} style={{ zIndex: msg.children.length - index, boxShadow: `0px 5px 15px 0px rgba(0, 0, 0, ${(0.1 / msg.children.length) * (msg.children.length - index)})` }}>
<div className="message-role">
<div className='role-box'>
{child.role}
</div>
</div>
<div className="message-content">
{editMessageId === child.id ? (
<TextArea
ref={editTextAreaRef}
autoSize
size='small'
className='edit-box'
type='text'
defaultValue={edit}
onChange={e => { handleEditChange(e) }}
onKeyDown={e => {
if (e.key === 'Enter' && !e.shiftKey) {
e.preventDefault();
handleEdit(chatId, child.id, edit);
}
}}
/>
) : (
<div className='message-text' >
<div className={`markdown-container ${!msg.cascade ? 'markdown-container-contracted' : ''}`}>
{
child.content.trim() !== '' ?
(<ReactMarkdown 
components={components}
remarkPlugins={remarkGfm}
children={child.content.toLowerCase().split('\n').map(line => line + '  ').join('\n')}
/>) : (
<p className='placeholder-markdown'>type a message...</p>)
}
</div>
</div>
)}
</div>
</div>
</li>
))}
</ul>
</div>
)}