import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import {FriendsContext} from "../../context/FriendsContext";
import FriendList from "../../components/FriendList";
import {Friend} from "../../types/friend";

const SearchFriendsScreen = () => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const [searchPhrase, setSearchPhrase] = useState("");
  const { friends } = useContext(FriendsContext);
  const [friendsList, setFriendsList] = useState<Friend[]>([]);

  useEffect(() => {
    setFriendsList(searchPhrase ? friends.filter(friend => {
      let matches = true;
      searchPhrase.split(' ').every(phrasePart => {
        if (!friend.name.toLowerCase().startsWith(phrasePart.toLowerCase()) &&
            !friend.surname.toLowerCase().startsWith(phrasePart.toLowerCase())) {
          matches = false
          return false
        }
        return true
      })
      return matches
    }) : friends)
  }, [friends]);

  const onNewFriendRequest = () => {
    navigation.navigate("NewFriend")
  };

  return (
    <>
      <View style={[styles.root, { height: height * 1 }]}>
        <View style={styles.windowTab}>
          <FriendList data={[
            {
              title: "Znajomi",
              data: friendsList,
            },
          ]} />
          <CustomInput
            placeholder="Szukaj"
            value={searchPhrase}
            setValue={setSearchPhrase}
            secureTextEntry={undefined}
            additionalStyle={styles.searchInput}
          />
          <CustomButton
            text="Dodaj nowego znajomego"
            onPress={onNewFriendRequest}
            type="PRIMARY"
            bgColor={undefined}
            fgColor={undefined}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#131417",
    flex: 1,
  },
  windowTab: {
    height: "75%",
    width: "100%",
    backgroundColor: "#1D1F24",
    top: "7%",
    borderRadius: 20,
    padding: 20,
  },
  text: {
    color: "#999999",
    marginTop: 20,
    marginBottom: 25,
  },
  link: {
    color: "#003f63",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: "5%",
    color: "#fff",
  },
  searchInput: {color: "#fff"},
});

export default SearchFriendsScreen;
