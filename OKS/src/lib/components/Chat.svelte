<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { user } from '$lib/stores/auth.js';
	import { getUserDisplayName, getDefaultAvatar } from '$lib/utils/avatarUtils.js';

	// Component props
	export let isOpen = false;
	export let chatTitle = 'Community Chat';
	export let placeholder = 'Type your message...';
	export let maxMessages = 100;
	export let enableTypingIndicator = true;

	// Internal state
	let messages = [];
	let newMessage = '';
	let isTyping = false;
	let typingUsers = [];
	let messageContainer;
	let inputElement;

	// Event dispatcher for parent component communication
	const dispatch = createEventDispatcher();

	// User state
	$: isLoggedIn = !!$user;
	$: userName = $user ? getUserDisplayName($user) : 'Guest';
	$: userAvatar = $user?.user_metadata?.avatar_url || getDefaultAvatar(userName);

	// Initialize with welcome message
	onMount(() => {
		if (messages.length === 0) {
			addSystemMessage('Welcome to the community chat! 🎉');
		}
	});


	// Add a system message
	function addSystemMessage(text) {
		const message = {
			id: Date.now(),
			type: 'system',
			text,
			timestamp: new Date(),
			user: 'System'
		};
		messages = [...messages, message];
		scrollToBottom();
	}

	// Add a user message
	function addUserMessage(text) {
		if (!text.trim()) return;
		
		const message = {
			id: Date.now(),
			type: 'user',
			text: text.trim(),
			timestamp: new Date(),
			user: userName,
			avatar: userAvatar,
			isOwn: true
		};
		
		messages = [...messages, message];
		newMessage = '';
		
		// Dispatch message event for parent component
		dispatch('message', {
			message: message.text,
			user: userName,
			timestamp: message.timestamp
		});
		
		scrollToBottom();
		
		// Simulate typing indicator for demo
		if (enableTypingIndicator) {
			simulateTypingResponse();
		}
		
		// Limit message history
		if (messages.length > maxMessages) {
			messages = messages.slice(-maxMessages);
		}
	}

	// Simulate typing response (for demo purposes)
	function simulateTypingResponse() {
		isTyping = true;
		typingUsers = ['Community Bot'];
		
		setTimeout(() => {
			const responses = [
				"I'm here to help! For specific questions about OKS, please visit our About page or contact us at board@orlandokannadasangha.org",
				"Thank you for your question! You can find more information on our website or reach out to our team.",
				"For membership information, please visit the Membership section or email us.",
				"I can help you navigate our website! What would you like to know about OKS?",
				"For event details and registration, please check our Events page.",
				"Thanks for reaching out! Feel free to explore our website or contact us for more information."
			];
			
			const randomResponse = responses[Math.floor(Math.random() * responses.length)];
			
			const responseMessage = {
				id: Date.now(),
				type: 'user',
				text: randomResponse,
				timestamp: new Date(),
				user: 'Community Bot',
				avatar: getDefaultAvatar('Community Bot'),
				isOwn: false
			};
			
			messages = [...messages, responseMessage];
			isTyping = false;
			typingUsers = [];
			scrollToBottom();
		}, 1500);
	}

	// Handle key press
	function handleKeyPress(event) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			addUserMessage(newMessage);
		}
	}

	// Scroll to bottom of messages
	function scrollToBottom() {
		if (messageContainer) {
			setTimeout(() => {
				messageContainer.scrollTop = messageContainer.scrollHeight;
			}, 100);
		}
	}

	// Format timestamp
	function formatTime(timestamp) {
		return new Date(timestamp).toLocaleTimeString([], { 
			hour: '2-digit', 
			minute: '2-digit' 
		});
	}

	// Close chat
	function closeChat() {
		isOpen = false;
		dispatch('close');
	}

	// Toggle chat
	function toggleChat() {
		isOpen = !isOpen;
		dispatch('toggle', { isOpen });
		if (isOpen) {
			setTimeout(() => {
				inputElement?.focus();
			}, 100);
		}
	}
</script>

<!-- Chat Toggle Button (floating) - Always visible -->
<button 
	class="chat-toggle-btn" 
	on:click={toggleChat}
	aria-label="{isOpen ? 'Close chat' : 'Open chat'}"
	title="{isOpen ? 'Close Community Chat' : 'Open Community Chat'}"
>
	<i class="fas fa-comments"></i>
	{#if !isOpen}
		<span class="chat-notification-dot"></span>
	{/if}
</button>

<!-- Chat Container -->
{#if isOpen}
	<div class="chat-container">
		<!-- Chat Header -->
		<div class="chat-header">
			<div class="chat-title">
				<i class="fas fa-comments me-2"></i>
				{chatTitle}
			</div>
			<div class="chat-actions">
				<button class="chat-action-btn" on:click={closeChat} aria-label="Close chat">
					<i class="fas fa-times"></i>
				</button>
			</div>
		</div>

		<!-- Messages Area -->
		<div class="chat-messages" bind:this={messageContainer}>
			{#each messages as message (message.id)}
				<div class="message-wrapper {message.type} {message.isOwn ? 'own' : ''}">
					{#if message.type === 'system'}
						<div class="system-message">
							<i class="fas fa-info-circle me-2"></i>
							{message.text}
							<span class="message-time">{formatTime(message.timestamp)}</span>
						</div>
					{:else}
						<div class="user-message">
							{#if !message.isOwn}
								<div class="user-avatar">
									<img src={message.avatar} alt={message.user} />
								</div>
							{/if}
							<div class="message-content">
								{#if !message.isOwn}
									<div class="message-user">{message.user}</div>
								{/if}
								<div class="message-bubble {message.isOwn ? 'own' : ''}">
									{message.text}
									<span class="message-time">{formatTime(message.timestamp)}</span>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/each}

			<!-- Typing Indicator -->
			{#if isTyping && typingUsers.length > 0}
				<div class="typing-indicator">
					<div class="typing-avatar">
						<img src={getDefaultAvatar('Bot')} alt="Typing..." />
					</div>
					<div class="typing-content">
						<div class="typing-text">
							{typingUsers.join(', ')} is typing
						</div>
						<div class="typing-dots">
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Message Input -->
		<div class="chat-input-container">
			{#if !isLoggedIn}
				<div class="login-prompt">
					<i class="fas fa-sign-in-alt me-2"></i>
					Please <a href="/login">login</a> to participate in the chat
				</div>
			{:else}
				<div class="chat-input-wrapper">
					<textarea
						bind:this={inputElement}
						bind:value={newMessage}
						on:keypress={handleKeyPress}
						placeholder={placeholder}
						class="chat-input"
						rows="1"
						maxlength="500"
					></textarea>
					<button 
						class="chat-send-btn" 
						on:click={() => addUserMessage(newMessage)}
						disabled={!newMessage.trim()}
						aria-label="Send message"
					>
						<i class="fas fa-paper-plane"></i>
					</button>
				</div>
				<div class="chat-input-footer">
					<span class="char-count">{newMessage.length}/500</span>
					<span class="input-hint">Press Enter to send, Shift+Enter for new line</span>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* Chat Toggle Button */
	.chat-toggle-btn {
		position: fixed;
		bottom: 20px;
		right: 20px;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: linear-gradient(135deg, #7a1f1f, #4c2e2e);
		border: none;
		color: white;
		font-size: 24px;
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(122, 31, 31, 0.3);
		transition: all 0.3s ease;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.chat-toggle-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(122, 31, 31, 0.4);
		background: linear-gradient(135deg, #8b2a2a, #5c3e3e);
	}

	.chat-notification-dot {
		position: absolute;
		top: 8px;
		right: 8px;
		width: 12px;
		height: 12px;
		background: #ff6b6b;
		border-radius: 50%;
		border: 2px solid white;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0% { transform: scale(1); opacity: 1; }
		50% { transform: scale(1.1); opacity: 0.7; }
		100% { transform: scale(1); opacity: 1; }
	}

	/* Chat Container */
	.chat-container {
		position: fixed;
		bottom: 90px;
		right: 20px;
		width: 360px;
		height: 520px;
		background: white;
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
		display: flex;
		flex-direction: column;
		z-index: 1001;
		border: 1px solid #e0d5c7;
		font-family: 'Georgia', serif;
	}

	/* Chat Header */
	.chat-header {
		background: linear-gradient(135deg, #7a1f1f, #4c2e2e);
		color: white;
		padding: 16px 20px;
		border-radius: 12px 12px 0 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.chat-title {
		font-size: 16px;
		font-weight: 500;
		display: flex;
		align-items: center;
	}

	.chat-actions {
		display: flex;
		gap: 8px;
	}

	.chat-action-btn {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
		transition: background-color 0.2s ease;
	}

	.chat-action-btn:hover {
		background: rgba(255, 255, 255, 0.1);
	}

	/* Messages Area */
	.chat-messages {
		flex: 1;
		overflow-y: auto;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		background: #fafafa;
	}

	.chat-messages::-webkit-scrollbar {
		width: 6px;
	}

	.chat-messages::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 3px;
	}

	.chat-messages::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 3px;
	}

	.chat-messages::-webkit-scrollbar-thumb:hover {
		background: #a8a8a8;
	}

	/* Message Wrapper */
	.message-wrapper {
		display: flex;
		flex-direction: column;
	}

	.message-wrapper.own {
		align-items: flex-end;
	}

	/* System Message */
	.system-message {
		background: #e8f4f8;
		color: #4c2e2e;
		padding: 8px 12px;
		border-radius: 8px;
		font-size: 13px;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border-left: 3px solid #7a1f1f;
	}

	.message-time {
		font-size: 11px;
		opacity: 0.7;
		margin-left: auto;
	}

	/* User Message */
	.user-message {
		display: flex;
		align-items: flex-end;
		gap: 8px;
		max-width: 80%;
	}

	.message-wrapper.own .user-message {
		flex-direction: row-reverse;
		align-self: flex-end;
	}

	.user-avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		overflow: hidden;
		flex-shrink: 0;
	}

	.user-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.message-content {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.message-user {
		font-size: 12px;
		color: #7a1f1f;
		font-weight: 500;
	}

	.message-wrapper.own .message-user {
		text-align: right;
	}

	.message-bubble {
		background: white;
		padding: 10px 14px;
		border-radius: 16px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		position: relative;
		word-wrap: break-word;
		line-height: 1.4;
	}

	.message-bubble.own {
		background: linear-gradient(135deg, #7a1f1f, #4c2e2e);
		color: white;
	}

	.message-bubble .message-time {
		display: block;
		font-size: 11px;
		opacity: 0.7;
		margin-top: 4px;
		text-align: right;
	}

	/* Typing Indicator */
	.typing-indicator {
		display: flex;
		align-items: flex-end;
		gap: 8px;
		margin-top: 8px;
	}

	.typing-avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		overflow: hidden;
		flex-shrink: 0;
	}

	.typing-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.typing-content {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.typing-text {
		font-size: 12px;
		color: #7a1f1f;
		font-weight: 500;
	}

	.typing-dots {
		display: flex;
		gap: 4px;
		align-items: center;
	}

	.typing-dots span {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #7a1f1f;
		animation: typing 1.4s infinite ease-in-out;
	}

	.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
	.typing-dots span:nth-child(2) { animation-delay: -0.16s; }

	@keyframes typing {
		0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
		40% { transform: scale(1); opacity: 1; }
	}

	/* Input Container */
	.chat-input-container {
		padding: 16px;
		border-top: 1px solid #e0d5c7;
		background: white;
		border-radius: 0 0 12px 12px;
	}

	.login-prompt {
		text-align: center;
		color: #7a1f1f;
		font-size: 14px;
		padding: 12px;
		background: #f9f7f4;
		border-radius: 8px;
		border: 1px solid #e0d5c7;
	}

	.login-prompt a {
		color: #7a1f1f;
		text-decoration: none;
		font-weight: 500;
	}

	.login-prompt a:hover {
		text-decoration: underline;
	}

	.chat-input-wrapper {
		display: flex;
		gap: 8px;
		align-items: flex-end;
	}

	.chat-input {
		flex: 1;
		border: 1px solid #e0d5c7;
		border-radius: 20px;
		padding: 10px 16px;
		font-family: 'Georgia', serif;
		font-size: 14px;
		resize: none;
		outline: none;
		transition: border-color 0.2s ease;
		min-height: 20px;
		max-height: 100px;
	}

	.chat-input:focus {
		border-color: #7a1f1f;
		box-shadow: 0 0 0 2px rgba(122, 31, 31, 0.1);
	}

	.chat-send-btn {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(135deg, #7a1f1f, #4c2e2e);
		border: none;
		color: white;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.chat-send-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, #8b2a2a, #5c3e3e);
		transform: scale(1.05);
	}

	.chat-send-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.chat-input-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 8px;
		font-size: 11px;
		color: #666;
	}

	.char-count {
		color: #7a1f1f;
		font-weight: 500;
	}

	.input-hint {
		color: #999;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.chat-container {
			width: calc(100vw - 40px);
			height: 460px;
			bottom: 75px;
			right: 20px;
			left: auto;
			top: auto;
		}

		.chat-toggle-btn {
			bottom: 15px;
			right: 15px;
		}

		.user-message {
			max-width: 90%;
		}
	}

	@media (max-width: 480px) {
		.chat-container {
			width: calc(100vw - 30px);
			height: 400px;
			bottom: 70px;
			right: 15px;
			left: auto;
			top: auto;
		}

		.chat-messages {
			padding: 12px;
		}

		.chat-input-container {
			padding: 12px;
		}
	}
</style>