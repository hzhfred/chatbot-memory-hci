
<div className={msg.role === "summary" ? 'summary-message' : ''}>
<div className={msg.visible ? 'message-wrapper' : 'message-wrapper message-hidden'}>

<div className="message-role">

<div className='role-box'>
<Checkbox
checked={selected.some(e => e.id === msg.id)}
onChange={(e) => handleSelect(e.target.checked, msg, chatId)}
/>
<span className="role" onClick={(e) => {

handleRoleDropdownToggle(msg.id)
}}>
{msg.role}
</span>
</div>

<AnimatePresence>
{roleDropdownId === msg.id && roleDropdownOpen && (
<motion.div
initial={{ opacity: 0, scale: 0.95, y: -5 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.95, y: -5 }}
transition={{ duration: 0.1 }}
>
<RoleDropdownMenu
className='role-dropdown-menu'
message={msg}
onClose={handleRoleDropdownToggle}
/>
</motion.div>
)}
</AnimatePresence>
<DropdownMenu
className='dropdown-menu'
chatId={chatId}
message={msg}
onClose={handleDropdownToggle}
chats={chats}
setChats={setChats}
setDropdownMessageId={setDropdownMessageId}
setDropdownOpen={setDropdownOpen}
setEditMessageId={setEditMessageId}
setEdit={setEdit}
/>
{msg.role == "summary" && (
<div className='summary-dropdown' onClick={e => { console.log("Button clicked!"); handleCascade(chatId, msg.id); }}>
<CaretDownOutlined className={msg.cascade ? 'cascade-icon' : 'cascade-icon cascade-icon-up'} />
</div>
)}
</div>
<div className="message-content">
{editMessageId === msg.id ? (
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
handleEdit(chatId, msg.id, edit);
}
}}
/>
) : (
<div className='message-text' onClick={e => {
setEdit(msg.content.toLowerCase());
setEditMessageId(msg.id);
}}>
<div className="markdown-container">
{
msg.content.trim() !== '' ?
<ReactMarkdown components={components} children={msg.content.toLowerCase().split('\n').map(line => line + '  ').join('\n')} remarkPlugins={remarkGfm} /> :
<p className='placeholder-markdown' >type a message...</p>
}
</div>
</div>
)}
</div>
</div>
</div>
{msg.role === "summary" && (
<div className='summary-children-container'>
<ul>
{msg.children && msg.children.map((child, index) => (
<li key={child.id} id={child.id} >
<div className={msg.cascade ? 'parent-message-wrapper child-message-expanded' : 'parent-message-wrapper child-message-retracted'} style={{ zIndex: msg.children.length - index }}>
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
<div className="markdown-container">
{
child.content.trim() !== '' && msg.cascade === false ?
(<ReactMarkdown 
components={components}
remarkPlugins={remarkGfm}
children={child.content.toLowerCase().split('\n').map(line => line + '  ').join('\n')}
/>
) : (
<p className='placeholder-markdown' >type a message...</p>)
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