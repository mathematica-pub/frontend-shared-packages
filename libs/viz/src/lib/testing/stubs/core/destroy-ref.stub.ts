/* eslint-disable @typescript-eslint/no-unused-vars */
import { DestroyRef } from '@angular/core';

export class DestroyRefStub extends DestroyRef {
  override onDestroy(callback: () => void): () => void {
    return () => {}; // Return an empty function
  }
}
