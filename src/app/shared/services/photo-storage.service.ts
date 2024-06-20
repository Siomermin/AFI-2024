import { Injectable, inject } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Observable, forkJoin, from, map, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoStorageService {
  private afStorage = inject(AngularFireStorage);

  public async takePhoto(): Promise<string> {
    try {
      // Take a photo
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });

      // Upload the photo to AngularFireStorage
      const storagePath = `fotos/${new Date().getTime()}.jpg`; // Provide a unique storage path
      const imageBlob = await fetch(capturedPhoto.webPath!).then(response =>
        response.blob()
      );
      const uploadTask = this.afStorage.upload(storagePath, imageBlob);

      await uploadTask.snapshotChanges().toPromise();

      // Photo uploaded successfully, get the download URL
      const downloadURL = await this.afStorage.ref(storagePath).getDownloadURL().toPromise();

      console.log('Photo added to Firestore.');

      return downloadURL;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  }



  public getPhotos(): Observable<any[]> {
    const storageRef = this.afStorage.ref('photos/');
    return storageRef.listAll().pipe(
      switchMap((result) => {
        const downloadURLs: Observable<string>[] = result.items.map((item) => {
          return from(item.getDownloadURL());
        });
        return forkJoin(downloadURLs).pipe(map((urls: string[]) => urls));
      })
    );
  }
}
