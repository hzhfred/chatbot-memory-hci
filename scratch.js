<div onMouseLeave={handleSummarizeHoverLeave} >
<button title='Summarize' onMouseEnter={(e) => handleSummarizeHover(chatId)} onClick={() => { if (hasSelectedMessage(chatId)) handleSummarize(chatId) }} className={hasSelectedMessage(chatId) ? 'input-button' : 'input-button-disabled'}><StackIcon size={16} /></button>
{
<div className={`text-area-modal ${hoveredChatId === chatId ? 'visible' : ''}`}>
<TextArea
id={`summary-prompt-text-area-id-${chatId}`}
defaultValue={summaryPrompt}
onChange={(e) => setSummaryPrompt(e.target.value)}
autoSize
/>
</div>
}
</div>