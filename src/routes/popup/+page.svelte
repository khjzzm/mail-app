<script lang="ts">
	let to = '';
	let subject = '';
	let body = '';
	let status = '';

	const handleSubmit = async () => {
		const res = await fetch('/api/send-email', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ to, subject, body })
		});
		const result = await res.json();
		status = result.success
			? '✅ 메일 전송 성공!'
			: `❌ 실패: ${result.message || result.error?.message}`;
	};
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<style>
      body {
          margin: 0;
          font-family: sans-serif;
      }
	</style>
</svelte:head>

<h2 style="text-align: center;">메일 보내기</h2>

<form on:submit|preventDefault={handleSubmit} style="max-width: 500px; margin: auto; display: flex; flex-direction: column; gap: 0.75rem;">
	<input bind:value={to} type="email" placeholder="받는 사람 이메일" required style="padding: 0.5rem;" />
	<input bind:value={subject} placeholder="제목" required style="padding: 0.5rem;" />
	<textarea bind:value={body} placeholder="본문" rows="6" required style="padding: 0.5rem;"></textarea>

	<button type="submit" style="margin-top: 1rem; padding: 0.75rem; background-color: royalblue; color: white; border: none; cursor: pointer;">
		메일 보내기
	</button>

	{#if status}
		<p style="text-align: center;">{status}</p>
	{/if}
</form>