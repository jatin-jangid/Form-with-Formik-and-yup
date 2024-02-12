import React, {useState} from 'react';
import {
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Formik, FieldArray} from 'formik';
import * as yup from 'yup';

interface Legs {
  DepartureLocation: string;
  ArrivalLocation: string;
  DepartureDate: string;
  NoOfPassengers: string;
}
interface FormErrors {
  legs?: Array<{
    DepartureLocation?: string;
    ArrivalLocation?: string;
    DepartureDate?: string;
    NoOfPassengers?: string;
  }>;
}

const legSchema = yup.object().shape({
  DepartureLocation: yup.string().required('Departure Location is required'),
  ArrivalLocation: yup.string().required('Arrival Location is required'),
  DepartureDate: yup.string().required('Departure Date is required'),
  NoOfPassengers: yup
    .number()
    .min(1, 'Number of Passengers should be at least 1')
    .required('Number of Passengers is required'),
});

const loginValidationSchema = yup.object().shape({
  legs: yup.array().of(legSchema),
});

export const Home = () => {
  const [chosenDate, setChosenDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<Legs[]>([]);

  const handleSubmit = (values: {legs: Legs[]}) => {
    console.log(values, 'value');
    setFormData(values.legs); // Store form data in state variable
    setModalVisible(true); // Show modal when form is submitted
  };

  return (
    <View style={styles.container}>
      <Formik
        validationSchema={loginValidationSchema}
        initialValues={{
          legs: [
            {
              DepartureLocation: '',
              ArrivalLocation: '',
              DepartureDate: '',
              NoOfPassengers: '',
            },
          ],
        }}
        onSubmit={handleSubmit}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          isValid,
          errors,
          validateForm,
        }) => (
          <View style={styles.container}>
            <ScrollView>
              <FieldArray
                name="legs"
                render={arrayHelpers => (
                  <View>
                    {values.legs.map((leg, index) => (
                      <View key={index} style={styles.leg}>
                        <TextInput
                          style={styles.textInput}
                          onChangeText={handleChange(
                            `legs.${index}.DepartureLocation`,
                          )}
                          placeholder="Departure Location"
                          value={leg.DepartureLocation}
                        />
                        {errors.legs &&
                          errors.legs[index] &&
                          errors.legs[index].DepartureLocation && (
                            <Text style={styles.errors}>
                              {errors.legs[index].DepartureLocation}
                            </Text>
                          )}
                        <TextInput
                          style={styles.textInput}
                          onChangeText={handleChange(
                            `legs.${index}.ArrivalLocation`,
                          )}
                          placeholder="Arrival Location"
                          value={leg.ArrivalLocation}
                        />
                        {errors.legs &&
                          errors.legs[index] &&
                          errors.legs[index].ArrivalLocation && (
                            <Text style={styles.errors}>
                              {errors.legs[index].ArrivalLocation}
                            </Text>
                          )}
                        <TextInput
                          style={styles.textInput}
                          onChangeText={handleChange(
                            `legs.${index}.DepartureDate`,
                          )}
                          placeholder="Departure Date"
                          value={leg.DepartureDate}
                        />
                        {errors.legs &&
                          errors.legs[index] &&
                          errors.legs[index].DepartureDate && (
                            <Text style={styles.errors}>
                              {errors.legs[index].DepartureDate}
                            </Text>
                          )}
                        <TextInput
                          style={styles.textInput}
                          onChangeText={handleChange(
                            `legs.${index}.NoOfPassengers`,
                          )}
                          placeholder="No Of Passengers"
                          value={leg.NoOfPassengers}
                        />
                        {errors.legs &&
                          errors.legs[index] &&
                          errors.legs[index].NoOfPassengers && (
                            <Text style={styles.errors}>
                              {errors.legs[index].NoOfPassengers}
                            </Text>
                          )}
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => arrayHelpers.remove(index)}>
                          <Text style={styles.removeButtonText}>
                            Remove Leg
                          </Text>
                        </TouchableOpacity>
                        {/* <Button
                      onPress={() => arrayHelpers.remove(index)}
                      title="Remove Leg"
                      color="red"
                    /> */}
                      </View>
                    ))}
                    <TouchableOpacity
                      style={styles.addLegButton}
                      onPress={() =>
                        arrayHelpers.push({
                          DepartureLocation: '',
                          ArrivalLocation: '',
                          DepartureDate: '',
                          NoOfPassengers: '',
                        })
                      }>
                      <Text style={styles.buttonText}>Add Leg</Text>
                    </TouchableOpacity>
                    {/* <Button
                  onPress={() =>
                    arrayHelpers.push({
                      DepartureLocation: '',
                      ArrivalLocation: '',
                      DepartureDate: '',
                      NoOfPassengers: '',
                    })
                  }
                  title="Add Leg"
                /> */}
                  </View>
                )}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  handleSubmit();
                  validateForm();
                }}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              {/* <Button
              onPress={() => {
                handleSubmit();
                validateForm();
              }}
              title="Submit"
              color={'green'}
            /> */}
            </ScrollView>
          </View>
        )}
      </Formik>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Form Data</Text>
              {formData.map((legs: any, index: number) => (
                <View key={index} style={styles.modalItem}>
                  <Text>Leg {index + 1}:</Text>
                  <Text>Departure Location: {legs.DepartureLocation}</Text>
                  <Text>Arrival Location: {legs.ArrivalLocation}</Text>
                  <Text>Departure Date: {legs.DepartureDate}</Text>
                  <Text>No. of Passengers: {legs.NoOfPassengers}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errors: {
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  textInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: 5,
    padding: 10,
  },
  leg: {
    backgroundColor: '#c4c4c4',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  removeButton: {
    backgroundColor: '#fc4e4e',
    width: 150,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  removeButtonText: {
    // color: '#ffffff',
    color: 'black',
    fontSize: 14,
    fontWeight: '400',
  },
  addLegButton: {
    backgroundColor: '#5a8cfa',
    width: 350,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    // marginTop: 10,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: 'lightgreen',
    width: 150,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonText: {
    // color: '#ffffff',
    color: 'black',
    fontSize: 18,
    fontWeight: '400',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    color: 'black',

    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItem: {
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'lightpink',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
  },
});

// import React, {useState} from 'react';
// import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
// import {Formik} from 'formik';
// import * as yup from 'yup';

// const loginValidationSchema = yup.object().shape({
//   DepartureLocation: yup
//     .string()
//     // .email('Please Enter Valid Email')
//     .required('Departure Location address is required'),
//   ArrivalLocation: yup
//     .string()
//     .min(8, 'Arrival Location must be minimum 8 characters')
//     .required('Arrival Location is required'),
//   DepartureDate: yup.string().required('Departure Date is Required'),
//   NoOfPassengers: yup
//     .number()
//     .min(1, 'Should be atleast 1')
//     .required('Number of Passengers is required'),
// });

// export const Home = () => {
//   const [chosenDate, setChosenDate] = useState(new Date());
//   return (
//     <Formik
//       validationSchema={loginValidationSchema}
//       initialValues={{
//         DepartureLocation: '',
//         ArrivalLocation: '',
//         DepartureDate: '',
//         NoOfPassengers: '',
//       }}
//       onSubmit={values => console.log(values)}>
//       {({
//         handleChange,
//         handleBlur,
//         handleSubmit,
//         values,
//         touched,
//         isValid,
//         errors,
//         validateForm, // Add validateForm function
//       }) => (
//         <View style={styles.container}>
//           <View style={styles.leg}>
//             <TextInput
//               style={styles.textInput}
//               onChangeText={handleChange('DepartureLocation')}
//               placeholderTextColor={'black'}
//               onBlur={handleBlur('DepartureLocation')}
//               value={values.DepartureLocation}
//               placeholder="Departure Location"
//             />
//             {/* Show errors for DepartureLocation */}
//             {errors.DepartureLocation && touched.DepartureLocation && (
//               <Text style={styles.errors}>{errors.DepartureLocation}</Text>
//             )}
//             {/* Add TextInput for ArrivalLocation */}
//             <TextInput
//               style={styles.textInput}
//               onChangeText={handleChange('ArrivalLocation')}
//               placeholderTextColor={'black'}
//               onBlur={handleBlur('ArrivalLocation')}
//               value={values.ArrivalLocation}
//               placeholder="Arrival Location"
//               secureTextEntry // Hide the input text for passwords
//             />
//             {/* Show errors for Arrival Location */}
//             {errors.ArrivalLocation && touched.ArrivalLocation && (
//               <Text style={styles.errors}>{errors.ArrivalLocation}</Text>
//             )}
//             {/* Add TextInput for Departure Date */}

//             <TextInput
//               style={styles.textInput}
//               onChangeText={handleChange('DepartureDate')}
//               placeholderTextColor={'black'}
//               onBlur={handleBlur('DepartureDate')}
//               value={values.DepartureDate}
//               placeholder="Departure Date"
//               secureTextEntry // Hide the input text for passwords
//             />
//             {/* Show errors for Departure Date */}
//             {errors.DepartureDate && touched.DepartureDate && (
//               <Text style={styles.errors}>{errors.DepartureDate}</Text>
//             )}
//             <TextInput
//               style={styles.textInput}
//               onChangeText={handleChange('NoOfPassengers')}
//               onBlur={handleBlur('NoOfPassengers')}
//               value={values.NoOfPassengers}
//               placeholder="No Of Passengers"
//               placeholderTextColor={'black'}
//               secureTextEntry // Hide the input text for passwords
//             />
//             {/* Show errors for No Of Passengers */}
//             {errors.NoOfPassengers && touched.NoOfPassengers && (
//               <Text style={styles.errors}>{errors.NoOfPassengers}</Text>
//             )}
//           </View>
//           <View style={{margin: 10}}>
//             <Button
//               onPress={() => {
//                 handleSubmit();
//                 validateForm();
//               }}
//               title="Submit"
//             />
//           </View>
//         </View>
//       )}
//     </Formik>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // padding: 10,
//   },
//   errors: {
//     fontSize: 14,
//     color: 'red',
//     fontWeight: 'bold',
//     margin: 5,
//   },
//   textInput: {
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: 'black',
//     margin: 5,
//     padding: 10,
//   },
//   leg: {
//     backgroundColor: 'lightgrey',
//     padding: 20,
//     borderRadius: 10,
//     margin: 10,
//   },
// });
