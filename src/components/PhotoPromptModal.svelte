<script lang="ts">
  import Modal from "./Modal.svelte";
  import { setTempPhotoUrl, setVerifiedPhotoUrl } from "$lib/stores/photoStore";
  import { getUserId } from "$lib/utils/auth";
  import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

  export let isOpen: boolean = false;

  async function handleUploadPhoto(isVerified: boolean) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const userId = getUserId();
      if (!userId) return;

      const storage = getStorage();
      const path = isVerified ? `verified/${userId}` : `temp/${userId}`;
      const fileRef = ref(storage, path);

      await uploadBytes(fileRef, file);
      const photoUrl = await getDownloadURL(fileRef);

      if (isVerified) {
        setVerifiedPhotoUrl(userId, photoUrl);
      } else {
        setTempPhotoUrl(userId, photoUrl);
      }

      isOpen = false;
    };
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
