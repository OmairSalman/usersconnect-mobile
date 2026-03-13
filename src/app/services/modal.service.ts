import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService
{
  showPleaseVerify = signal(false);
  showEmailVerification = signal(false);
  showConfirm = signal(false);
  confirmMessage = signal('');
  confirmType = signal<'post' | 'comment'>('post');
  confirmCallback: (() => void) | null = null;
  
  showPleaseVerifyModal()
  {
    this.showPleaseVerify.set(true);
  }

  showEmailVerificationModal()
  {
    this.showEmailVerification.set(true);
  }

  closePleaseVerifyModal()
  {
    this.showPleaseVerify.set(false);
  }

  closeEmailVerificationModal()
  {
    this.showEmailVerification.set(false);
  }

  startVerification()
  {
    this.closePleaseVerifyModal();
    this.showEmailVerificationModal();
  }

  showConfirmModal(message: string, type: 'post' | 'comment', onConfirm: () => void)
  {
    this.confirmMessage.set(message);
    this.confirmType.set(type);
    this.confirmCallback = onConfirm;
    this.showConfirm.set(true);
  }
  
  confirmYes()
  {
    if (this.confirmCallback)
    {
      this.confirmCallback();
    }
    this.closeConfirmModal();
  }
  
  confirmNo()
  {
    this.closeConfirmModal();
  }
  
  closeConfirmModal()
  {
    this.showConfirm.set(false);
    this.confirmMessage.set('');
    this.confirmCallback = null;
  }
}