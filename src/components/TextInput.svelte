<script lang="ts">
    export let name = 'email';
    export let type = 'email';
    export let autocomplete = 'on';
    export let isRequired = true;
    export let placeholder = 'placeholder text';
    export let value: string = '';
    export let dataInputName: string = 'data-import-name'

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        value = target.value;
    }
</script>

<div>
    <input
        id={name}
        data-input-name={dataInputName}
        name={name}
        type={type} 
        autocomplete={autocomplete}
        placeholder={placeholder}
        required={isRequired}
        {value}
        on:input={handleInput}
        class="mb-16 text-sm block w-full px-8 py-8 border border-medium-gray rounded-md">
        <div class="error-message" data-error-for="{dataInputName}"></div>
</div>