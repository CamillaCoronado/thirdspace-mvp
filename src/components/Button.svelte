<script>
    export let text = 'Button';
    export let bgColor = 'bg-indigo';
    export let color = 'text-white';
    export let buttonType = undefined;
    export let border = 'border solid';
    export let borderWidth = '1px';
    export let borderColor = 'indigo';
    export let maxWidth= 'max-w-30';
    export let width = 'full';
</script>

<button 
type = {buttonType}
on:click
class={`w-${width} rounded-full py-12 mb-16 ${maxWidth} ${border} ${borderWidth} ${borderColor} ${bgColor} ${color}`}>
    {text}
</button>