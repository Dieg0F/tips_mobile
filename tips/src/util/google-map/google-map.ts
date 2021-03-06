declare var google;

export class GoogleMaps {

    public style: any;
    public zoomValue = 15;
    public enableScroll = false;
    public setDisableDefaultUI = true;
    public localPosition: any;
    public enableZoomControl = false;
    public enableRotateControl = false;
    public htmlMap: any;

    constructor(map: any) {
        this.htmlMap = map;
        this.mapStyle();
    }

    /**
     * @description get user address lat and lgn.
     * @param address user full address.
     */
    public getLocation(address: string) {
        const geo = new google.maps.Geocoder();
        geo.geocode({ address }, (results, status) => {
            if (status === 'OK') {
                this.localPosition = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                this.buildMap();
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    /**
     * @description build a Google Maps map.
     */
    public buildMap() {
        const mapOptions = {
            zoom: this.zoomValue,
            center: this.localPosition,
            disableDefaultUI: this.setDisableDefaultUI,
            scroll: this.enableScroll,
            styles: this.style,
            zoomControl: this.enableZoomControl,
            rotateControl: this.enableRotateControl,
            gestureHandling: 'cooperative',
        };

        const marker = new google.maps.Marker({
            position: this.localPosition,
            map: new google.maps.Map(this.htmlMap, mapOptions),
            title: 'Minha posição',
            animation: google.maps.Animation.DROP,
        });
    }

    /**
     * @description set GoogleMaps style.
     */
    public mapStyle() {
        this.style = [
            {
                elementType: 'geometry',
                stylers: [{
                    color: '#242f3e',
                }],
            },
            {
                elementType: 'labels.text.stroke',
                stylers: [{
                    color: '#242f3e',
                }],
            },
            {
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#746855',
                }],
            },
            {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#d59563',
                }],
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#d59563',
                }],
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{
                    color: '#263c3f',
                }],
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#6b9a76',
                }],
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{
                    color: '#38414e',
                }],
            },
            {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{
                    color: '#212a37',
                }],
            },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#9ca5b3',
                }],
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{
                    color: '#746855',
                }],
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{
                    color: '#1f2835',
                }],
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#f3d19c',
                }],
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{
                    color: '#2f3948',
                }],
            },
            {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#d59563',
                }],
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{
                    color: '#17263c',
                }],
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#515c6d',
                }],
            },
            {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{
                    color: '#17263c',
                }],
            },
        ];
    }

}
