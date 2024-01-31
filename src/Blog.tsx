import React, {useState, useContext, useEffect }from 'react'
import {View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ImageBackground} from 'react-native'
import Registration from './RegistrationScreen'
import {CreateAuthContext} from "./CreateAuthContext"
import Spinner from "react-native-loading-spinner-overlay"
import {AuthContext} from "./AuthContext"
import DocumentPicker from 'react-native-document-picker';


const Blog = (props) => {
	const [title, setTitle] = useState(null);
	const [body, setBody] = useState(null);
	const [image, setImage] = useState(null);
	const {isLoading, createBlog, userInfo} = useContext(AuthContext);

	const pickImage = async () => {
		try{
			const doc = await DocumentPicker.pick();
		console.log(doc);
	} catch(err){
		if(DocumentPicker.isCancle(e))
			console.log("User cancel the upload", e);
		else
			console.log(err);
	}
    
  };

  const uploadBlog = () => {
    // Implement your API logic to upload the blog with the selected image
    // You can use the 'image' state to access the selected image details (e.g., image.uri)
    // Example API call: axios.post('/upload-blog', { title, body, image: image.uri });
  };

	return (
		<ImageBackground
      source={require('./assest/background.jpg')}
      style={styles.background}
    >
			<View style={styles.container}>
				<Text style={styles.logins}>{createBlog}</Text>
				<Text style={styles.logins}>Create Blog</Text>
				
				<View style={styles.wraper}>
					<TextInput 
						value={title} 
						style={styles.input} 
						placeholder="Enter Title"
						onChangeText={text => setTitle(text)} 
					/>
					<TextInput  
						value={body} 
						style={styles.input} 
						placeholder="Description of the blog" 
						onChangeText={text => setBody(text)}
					/>
					<Button title="Select image" onPress={pickImage} />
		      {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />}
					<Button title="Create Blog" onPress={() => {createBlog(title, body, userInfo)}} />	
				</View>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: "#6eccf5",
		marginTop: "20%",
		borderTopLeftRadius: 80,
		borderTopRightRadius: 80,
		borderColor: "#fff"
	},
	wraper:{
		width: "80%"
	},
	input: {
		marginBottom: 12,
		borderWidth:1,
		borderColor: "#fff",
		borderRadius: 5,
		paddingHorizontal: 14
	},
	link: {
		color: "blue",
	},
	logins:{
		fontSize: 50,
		marginTop: "-50%",
		marginBottom: 30,
		fontWeight: "bold"
	},
	background: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    justifyContent: 'center',
  },
});
export default Blog;