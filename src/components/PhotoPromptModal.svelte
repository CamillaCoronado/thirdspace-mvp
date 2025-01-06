<script lang="ts">
  import Modal from "./Modal.svelte";
  import { setTempPhotoUrl, setVerifiedPhotoUrl } from "$lib/stores/photoStore";
  import { getUserId } from "$lib/utils/auth";

  export let isOpen: boolean = false;

  // Handle uploading a temporary or verified photo
  function handleUploadPhoto(isVerified: boolean) {
    const photoUrl = "https://example.com/photo.jpg"; // Simulate an uploaded photo URL
    const userId = getUserId() || undefined;
    if (userId) {
        if (isVerified) {
            setVerifiedPhotoUrl(userId, photoUrl);
        } else {
            setTempPhotoUrl(userId, photoUrl);
        }
    }
  }
</script>

<Modal
  bind:isOpen={isOpen}
  title="Add a photo to start chatting"
  content="Upload a photo to verify your profile. You cannot send messages without a photo."
  buttons={[
    {
      label: "Upload Temporary Photo",
      onClick: () => handleUploadPhoto(false),
    },
    {
      label: "Upload Verified Photo",
      onClick: () => handleUploadPhoto(true),
    },
  ]}
/>
