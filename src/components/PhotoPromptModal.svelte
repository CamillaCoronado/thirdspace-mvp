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
  {isOpen}
  title="Add a photo to start chatting"
  content="Upload a photo to verify your profile. You cannot send messages without a photo."
  buttons={[
    {
      label: "Upload Temporary Photo",
      class: "bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600",
      onClick: () => handleUploadPhoto(false),
    },
    {
      label: "Upload Verified Photo",
      class: "bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800",
      onClick: () => handleUploadPhoto(true),
    },
    {
      label: "Cancel",
      class: "bg-purple-300 text-purple-800 px-4 py-2 rounded hover:bg-purple-400",
      onClick: () => (isOpen = false),
    },
  ]}
/>
