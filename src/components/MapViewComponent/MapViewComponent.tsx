import { StyleSheet, View, Text } from "react-native";
import React, { useRef, useEffect, useState, useContext } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import CustomButton from "../../components/CustomButton";
import { LatLngData, MarkerData } from "../../types/marker";
import { LocationContext } from "../../context/LocationContext";
import { ApiContext } from "../../context/ApiContext";
import { EventsContext } from "../../context/EventsContext";
import { Event } from "../../types/event";
import { useNavigation } from "@react-navigation/native";

const MapViewComponent = () => {
  const navigation = useNavigation();
  const {
    eventsCreated,
    eventsInvited,
    eventsOther,
    eventsCreatedSearch,
    eventsInvitedSearch,
    eventsOtherSearch,
    loadCloseEvents,
    clearSearchEvents,
    isSearchActive,
  } = useContext(EventsContext);
  const { userLocation, shareLocation, setShareLocation } =
    useContext(LocationContext);
  const { get, userToken } = useContext(ApiContext);
  const mapViewRef = useRef<MapView>(null);
  const [isUserLocationHandled, setUserLocationHandled] = useState(false);
  const [region, setRegion] = useState({
    latitude: userLocation?.coords.latitude ?? 52.4064,
    longitude: userLocation?.coords.longitude ?? 16.9252,
    latitudeDelta: 0.14,
    longitudeDelta: 0.16,
  });
  useEffect(() => {
    if (isUserLocationHandled || !userLocation) return;
    setUserLocationHandled(true);
    let regionUser = {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.14,
      longitudeDelta: 0.16,
    };
    loadCloseEvents(regionUser);
  }, [userLocation]);

  const [markers, setMarkers] = useState<Event[]>([]);
  const [friendsMarkers, setFriendsMarkers] = useState<MarkerData[]>([]);

  const onRegionChange = (newRegion) => {
    setRegion(newRegion);
  };
  const onShareLocationToggle = () => {
    setShareLocation(!shareLocation);
  };
  const onLoadCloseEvents = () => {
    loadCloseEvents(region);
  };

  useEffect(() => {
    if (mapViewRef.current) {
      mapViewRef.current.animateToRegion(region, 1000);
    }
  }, []);

  useEffect(() => {
    if (isSearchActive) {
      setMarkers(
        eventsCreatedSearch.concat(eventsInvitedSearch, eventsOtherSearch)
      );
      return;
    }
    setMarkers(eventsCreated.concat(eventsInvited, eventsOther));
  }, [
    eventsCreated,
    eventsInvited,
    eventsOther,
    eventsCreatedSearch,
    eventsInvitedSearch,
    eventsOtherSearch,
    isSearchActive,
  ]);

  const updateFriendsMarkers = () => {
    get("user/location/get-friends", null, (res) => {
      let latlngData: LatLngData;
      let newMarkers: MarkerData[] = [];
      for (var k in res.data) {
        latlngData = res.data[k];
        newMarkers.push({ latlng: latlngData, name: k, description: "friend" });
      }
      setFriendsMarkers(newMarkers);
    });
  };

  useEffect(() => {
    if (!userToken) {
      return;
    }
    updateFriendsMarkers();
    const interval = setInterval(
      () => updateFriendsMarkers(),
      parseInt(process.env.EXPO_PUBLIC_LOCALIZATION_UPDATE_TIME)
    );
    return () => clearInterval(interval);
  }, [userToken]);

  return (
    <>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        onRegionChange={onRegionChange}
        showsUserLocation={true}
        userInterfaceStyle="dark"
        followsUserLocation={true}
        ref={mapViewRef}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.latlng}
            title={marker.name}
            description={marker.description}
            // TUTAJ ZMIANY Z WIDOKIEM I PRZEKIEROWANIEM - nie wiem jak przekazac obiekt do EventView
            onPress={() => {navigation.navigate("EventView", { object: marker });}}
          >
            // <Callout tooltip style={styles.callout}>
            //   <View>
            //     <Text style={styles.title}>{marker.name}</Text>
            //     <View style={styles.hr} />
            //     <Text style={styles.date}>
            //       {new Date(marker.date.date).toLocaleString([], {
            //         year: "numeric",
            //         month: "numeric",
            //         day: "numeric",
            //         hour: "2-digit",
            //         minute: "2-digit",
            //       })}
            //     </Text>
            //     <View style={styles.hr} />
            //     <Text style={styles.address}>{marker.address}</Text>
            //     <CustomButton
            //       text="Szczegóły wydarzenia"
            //       onPress={() => {
            //         navigation.navigate("EventView", { object: marker });
            //       }}
            //       type="PRIMARY"
            //       bgColor={undefined}
            //       fgColor={undefined}
            //       additionalStyles={undefined}
            //     />
            //   </View>
            // </Callout>
          </Marker>
        ))}
        {friendsMarkers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.name}
            description={marker.description}
          >
            <Callout tooltip style={styles.callout}>
              <View>
                <Text style={styles.title}>{marker.name}</Text>
                <Text style={styles.description}>{marker.description}</Text>
                <CustomButton
                  text="Details"
                  onPress={() => {}}
                  type="PRIMARY"
                  bgColor={undefined}
                  fgColor={undefined}
                  additionalStyles={undefined}
                />
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <CustomButton
        additionalStyles={{
          position: "absolute",
          top: "70%",
          left: "35%",
          width: "20%",
          marginHorizontal: "5%",
        }}
        text={shareLocation ? "Sharing on" : "Sharing off"}
        onPress={onShareLocationToggle}
        type="PRIMARY"
        bgColor={undefined}
        fgColor={undefined}
      />
      {isSearchActive && (
        <CustomButton
          additionalStyles={{
            position: "absolute",
            top: "70%",
            left: "55%",
            width: "20%",
            marginHorizontal: "5%",
          }}
          text="Clear search"
          onPress={clearSearchEvents}
          type="PRIMARY"
          bgColor={undefined}
          fgColor={undefined}
        />
      )}
      <CustomButton
        additionalStyles={{
          position: "absolute",
          top: "70%",
          left: "5%",
          width: "20%",
          marginHorizontal: "5%",
        }}
        text="Load close events"
        onPress={onLoadCloseEvents}
        type="PRIMARY"
        bgColor={undefined}
        fgColor={undefined}
      />
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: -1,
    elevation: 1,
  },
  callout: {
    backgroundColor: "#131417",
    width: 240,
    borderRadius: 20,
    padding: 20,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 0,
  },
  description: {
    color: "#fff",
    fontSize: 14,
  },
  address: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 20,
  },
  date: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 0,
  },
  hr: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default MapViewComponent;
