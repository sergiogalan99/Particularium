import { GeoPoint } from './../../core/model/interfaces/geopoint';
import { Injectable } from '@angular/core';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IGeolocation } from 'src/app/interfaces/geolocation-i';
@Injectable({
  providedIn: 'root'
})
export class AdapterGeolocalitationService implements IGeolocation {
  constructor(
    public geolocation: Geolocation,
    public geocoder: NativeGeocoder) { }

    async getUserLocation(): Promise<string> {
    let latitude: number, longitude: number;
    const geocoderOptions: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 1
    };
    await this.geolocation.getCurrentPosition().then((resp) => {
      latitude = resp.coords.latitude;
      longitude = resp.coords.longitude;
    }).catch((error) => {
      alert(JSON.stringify(error));
    });
    return new Promise((resolve, reject) => {
      this.geocoder.reverseGeocode(latitude, longitude, geocoderOptions).then((result: NativeGeocoderResult[]) => {
        resolve(JSON.stringify(result[0]));
      }).catch((error) => reject('Ha ocurrido un error'));
    });
  }

  public ForwardGeocoding(address: string): Promise<GeoPoint | string> {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 1
    };
    return new Promise((resolve, reject) => {
      this.geocoder.forwardGeocode(address, options)
        .then((result: NativeGeocoderResult[]) => {
          const geo: GeoPoint = {
            latitude: result[0].latitude,
            longitude: result[0].longitude
          };
          resolve(geo);
        })
        .catch((error: any) => reject('Datos Incorrectos'));
    });

  }
}
