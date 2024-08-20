<script>
    export let text = 'Button';
    export let bgColor = 'bg-dark-pink';
    export let color = 'text-white';
    export let buttonType = undefined;
    export let border = 'border solid'
    export let borderWidth = '1px';
    export let borderColor = 'dark-pink';
</script>

<button 
type = {buttonType}
on:click
class={`btn w-full rounded-full py-12 mb-16 ${border} ${borderWidth} ${borderColor} ${bgColor} ${color}`}>
    {text}
</button>