<script>
    export let text = 'Button';
    export let bgColor = 'bg-indigo';
    export let color = 'white';
    export let buttonType = undefined;
    export let border = 'border solid'
    export let borderWidth = '1px';
    export let borderColor = 'indigo';
</script>

<button 
type = {buttonType}
on:click
class={`btn w-full rounded-full py-12 mb-16 ${border} ${borderWidth} ${borderColor} ${bgColor} text-${color}`}>
    {text}
</button>