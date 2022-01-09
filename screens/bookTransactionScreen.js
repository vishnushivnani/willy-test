import React from 'react';
import {Text,View,StyleSheet,TouchableOpacity,TextInput,Image} from 'react-native';
import * as Permissions from  'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner'; 
import * as firebase from 'firebase';
import db from '../config.js'  

export default class bookTransactionScreen extends React.Component{
    
    constructor(){
        super();
        this.state={
           hasCameraPermissions:null,
           scanned:false,
           scannedData:'',
           buttonState:'normal',
           scannedBookId:'',
           scannedStudentId:''
        }
    }

    getCameraPermissions = async (id)=>{
        const { status }  = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermissions:status==="granted",
            buttonState:id,
            scanned:false

        });

    }
    handleBarCodeScan = async ({type,data})=>{
        const {buttonState}=this.state
        if(buttonState==="BookId"){
            this.setState({
                scanned:true,
                scannedData:data,
                buttonState:'normal',
    
            });
        
        }else if(buttonState==="StudentId"){
            this.setState({
                scanned:true,
                scannedData:data,
                buttonState:'normal',
    
            });
        
        }
    }
    handleTransaction=()=>{
       var transactionMessage 
       db.collection("Books").doc(this.state.scannedBookId).get()
       .then((doc)=>{
         console.log(doc.data())
         var book = doc.data()
         if(book.bookAvaliability){
           this.initiateBookIssue();
           transactionMessage="book Issued"
         }
         else{
           this.initiateBookReturn();
           transactionMessage="Book Returned"
         }
       })
       this.setState({
         transactionMessage:transactionMessage
       })
    }
  
    initiateBookIssue=async()=>{

      db.collection("Transactions").add({
        'studentId':this.state.scannedStudentId,
        'bookId':this.state.scannedBookId,
        'date':firebase.firestore.TimeStamp.now().toDate(),
        'transactionType':"issue"
      })
      db.collection("Books").doc(this.state.scannedBookId).update({
        'bookAvailiability':false

      })
      db.collection("Students").doc(this.state.scannedStudentId).update({
        'numberOFBooksIssued':firebase.firestore.FieldValue.increment(1)
      })
      Alert.alert("Book Issued")
      this.setState({
        scannedBookId:'',
        scannedStudentId:'',
        

      })

    }

    render(){ 
             const hasCameraPermissions=this.state.hasCameraPermissions;
             const scanned = this.state.scanned;
             const buttonState=this.state.buttonState;
             if(buttonState !== "normal" && hasCameraPermissions){
                return(
                  <BarCodeScanner
                    onBarCodeScanned = {scanned ? undefined : this.handleBarCodeScan}
                    style = {StyleSheet.absoluteFillObject}
                  />
                );
              }
          
              else if (buttonState === "normal"){
                return(
                  <View style={styles.container}>
                  <View>
                    <Image
                      source = {require("../assets/booklogo.jpg")}
                      style= {{width:200, height:200}}/>
                    <Text style={{textAlign:'center', fontSize:30,}}>Wily</Text>
                  </View>
                  <View style={styles.inputView}>
                  <TextInput
                    style={styles.inputBox}
                    placeholder="Book Id"
                    value={this.state.scannedBookId}/>
                  <TouchableOpacity
                    style={styles.scanButton}
                    onPress={()=>{
                      this.getCameraPermissions("BookId")
                    }}>
                    <Text style={styles.buttonText}>Scan</Text>
                  </TouchableOpacity>
                  </View>
          
                  <View style={styles.inputView}>
                  <TextInput
                    style={styles.inputBox}
                    placeholder="Student Id"
                    value={this.state.scannedStudentId}/>
                  <TouchableOpacity
                    style={styles.scanButton}
                    onPress={()=>{
                      this.getCameraPermissions("StudentId")
                    }}>
                    <Text style={styles.buttonText}>Scan</Text>
                  </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.submitButton} onPress={async()=>{this.handleTransaction()}
                     }
                  >
                       <Text style={styles.submitButtonText}>Submit</Text>
                
                </TouchableOpacity>
    
                </View>
          
                    );
                }
                  }
                  }
                
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    displayText:{
      fontSize:15,
      textDecorationLine:'underline'

    },
    scanButton:{
        width:'30%',
        height:20,
        alignSelf:'center'
        ,alignItems:'center',
    },
    buttonText:{
        fontSize:30,
        alignSelf:'center',
        backgroundColor:'blue'
    },
    inputBox:{
        width:200,
        height:40,
        borderWidth:1.5,
        borderRightWidth: 0 ,
        fontSize:20
    },
    inputView:{
        flexDirection:'row',
        margin:20,
        borderRightColor:'red'


    },
    submitButton:{
        backgroundColor:'red'
        ,width:100,
        height:50,
        
    },
    submitButtonText:{
        padding:10,
        textAlign:'center',
       fontWeight:'bold',
        fontSize:20,
        color:'white'
    }


})