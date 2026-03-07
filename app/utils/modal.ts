export const openModal = (id: string) => {
  const element = document.getElementById(id);

  if (element instanceof HTMLDialogElement) {
    element.showModal();
  }
};