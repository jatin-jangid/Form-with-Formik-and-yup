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
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';

interface Legs {
  DepartureLocation: string;
  ArrivalLocation: string;
  DepartureDate: string;
  NoOfPassengers: string;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const legSchema = yup.object().shape({
  DepartureLocation: yup.string().required('Departure Location is required'),
  ArrivalLocation: yup
    .string()
    .required('Arrival Location is required')
    .notOneOf(
      [yup.ref('DepartureLocation'), null], // Compare against 'departureLocation'
      'Arrival location cannot be the same as departure location',
    ),
  DepartureDate: yup
    .date()
    .required('Departure Date is required')
    .min(new Date(), 'Departure date must be in the future'),
  NoOfPassengers: yup
    .number()
    .min(1, 'Number of Passengers should be at least 1')
    .required('Number of Passengers is required'),
  // .matches(/^[0-9]+$/, 'Should be a number'),
});

const loginValidationSchema = yup.object().shape({
  legs: yup
    .array()
    .of(legSchema)
    .test(
      'is-ascending',
      'Dates must be in ascending order',
      function (value: any) {
        let isValid = true;
        for (let i = 1; i < value.length; i++) {
          if (
            new Date(value[i].DepartureDate!) <
            new Date(value[i - 1].DepartureDate!)
          ) {
            isValid = false;
            break;
          }
        }
        return isValid;
      },
    ),
});

const countries = [
  'India',
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Japan',
  'China',
  'Brazil',
  'India',
  'Russia',
  'South Korea',
  'Mexico',
  'Indonesia',
  'Turkey',
  'Netherlands',
  'Saudi Arabia',
  'Switzerland',
  'Sweden',
  'Belgium',
  'Norway',
  'Austria',
  'Denmark',
];

export const Home = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<Legs[]>([]);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [chosenDates, setChosenDates] = useState<Date[]>([new Date()]);

  const handleSubmit = (values: {legs: Legs[]}) => {
    console.log(values, 'value');
    setFormData(values.legs);
    setModalVisible(true);
  };

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
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
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          setFieldValue,
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
                        <Picker
                          selectedValue={leg.DepartureLocation}
                          onValueChange={itemValue =>
                            setFieldValue(
                              `legs.${index}.DepartureLocation`,
                              itemValue as string,
                            )
                          }>
                          <Picker.Item
                            label="Select Departure Country"
                            value=""
                          />
                          {countries.map((country, idx) => (
                            <Picker.Item
                              key={idx}
                              label={country}
                              value={country}
                            />
                          ))}
                        </Picker>
                        {errors.legs &&
                          errors.legs[index] &&
                          errors.legs[index].DepartureLocation && (
                            <Text style={styles.errors}>
                              {errors.legs[index].DepartureLocation}
                            </Text>
                          )}
                        <Picker
                          selectedValue={leg.ArrivalLocation}
                          onValueChange={itemValue =>
                            setFieldValue(
                              `legs.${index}.ArrivalLocation`,
                              itemValue as string,
                            )
                          }>
                          <Picker.Item
                            label="Select Arrival Country"
                            value=""
                          />
                          {countries.map((country, idx) => (
                            <Picker.Item
                              key={idx}
                              label={country}
                              value={country}
                            />
                          ))}
                        </Picker>
                        {errors.legs &&
                          errors.legs[index] &&
                          errors.legs[index].ArrivalLocation && (
                            <Text style={styles.errors}>
                              {errors.legs[index].ArrivalLocation}
                            </Text>
                          )}
                        <TouchableOpacity
                          style={styles.textInput}
                          onPress={() => {
                            setShowDatePicker(true);
                            setChosenDates(prevDates => {
                              const newDates = [...prevDates];
                              newDates[index] = leg.DepartureDate
                                ? new Date(leg.DepartureDate)
                                : new Date();
                              return newDates;
                            });
                          }}>
                          <Text>
                            {' '}
                            Select Date :{' '}
                            {chosenDates[index]
                              ? formatDate(chosenDates[index])
                              : 'Select a date'}
                          </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                          <DateTimePicker
                            value={chosenDates[index] || today}
                            minimumDate={today}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                              setShowDatePicker(false);
                              if (selectedDate) {
                                setChosenDates(prevDates => {
                                  const newDates = [...prevDates];
                                  newDates[index] = selectedDate;
                                  return newDates;
                                });
                                setFieldValue(
                                  `legs.${index}.DepartureDate`,
                                  selectedDate.toISOString(),
                                );
                              }
                            }}
                          />
                        )}
                        {errors.legs &&
                          errors.legs[index] &&
                          errors.legs[index].DepartureDate && (
                            <Text style={styles.errors}>
                              {errors.legs[index].DepartureDate}
                            </Text>
                          )}
                        <TextInput
                          style={styles.textInput}
                          keyboardType="numeric"
                          onChangeText={text => {
                            // Regular expression to match only numbers
                            const numericInput = text.replace(/[^0-9]/g, '');
                            // Update the field value with the cleaned numeric input
                            handleChange(`legs.${index}.NoOfPassengers`)(
                              numericInput,
                            );
                          }}
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
                        {values.legs.length > 1 && (
                          <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => arrayHelpers.remove(index)}>
                            <Text style={styles.removeButtonText}>
                              Remove Leg
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                    {values.legs.length < 5 && (
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
                    )}
                  </View>
                )}
              />
              {errors.legs && typeof errors.legs === 'string' && (
                <Text style={{color: 'red'}}>{errors.legs}</Text>
              )}
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  handleSubmit();
                  validateForm();
                }}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItem: {
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
  },
});
