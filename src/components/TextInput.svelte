<script lang="ts">
    export let name = 'email';
    export let type = 'email';
    export let autocomplete = 'on';
    export let isRequired = true;
    export let placeholder = 'placeholder text';
    export let value: string = '';

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        value = target.value;
    }
</script>

<div>
    <input
        id={name}
        name={name}
        type={type} 
        autocomplete={autocomplete}
        placeholder={placeholder}
        required={isRequired}
        {value}
        on:input={handleInput}
        class="mb-16 text-sm block w-full px-8 py-8 border border-medium-gray rounded-md">
        <div class="error-message"></div>
</div>