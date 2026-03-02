export const openModal = () => {
  const element = document.getElementById('modal');

  if (element instanceof HTMLDialogElement) {
    element.showModal();
  }
};