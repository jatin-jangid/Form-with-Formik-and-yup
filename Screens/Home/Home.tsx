import React, {useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';

const loginValidationSchema = yup.object().shape({
  DepartureLocation: yup
    .string()
    // .email('Please Enter Valid Email')
    .required('Departure Location address is required'),
  ArrivalLocation: yup
    .string()
    .min(8, 'Arrival Location must be minimum 8 characters')
    .required('Arrival Location is required'),
  DepartureDate: yup.string().required('Departure Date is Required'),
  NoOfPassengers: yup
    .number()
    .min(1, 'Should be atleast 1')
    .required('Number of Passengers is required'),
});

export const Home = () => {
  const [chosenDate, setChosenDate] = useState(new Date());
  return (
    <Formik
      validationSchema={loginValidationSchema}
      initialValues={{
        DepartureLocation: '',
        ArrivalLocation: '',
        DepartureDate: '',
        NoOfPassengers: '',
      }}
      onSubmit={values => console.log(values)}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        touched,
        isValid,
        errors,
        validateForm, // Add validateForm function
      }) => (
        <View style={styles.container}>
          <View style={styles.leg}>
            <TextInput
              style={styles.textInput}
              onChangeText={handleChange('DepartureLocation')}
              placeholderTextColor={'black'}
              onBlur={handleBlur('DepartureLocation')}
              value={values.DepartureLocation}
              placeholder="Departure Location"
            />
            {/* Show errors for DepartureLocation */}
            {errors.DepartureLocation && touched.DepartureLocation && (
              <Text style={styles.errors}>{errors.DepartureLocation}</Text>
            )}
            {/* Add TextInput for ArrivalLocation */}
            <TextInput
              style={styles.textInput}
              onChangeText={handleChange('ArrivalLocation')}
              placeholderTextColor={'black'}
              onBlur={handleBlur('ArrivalLocation')}
              value={values.ArrivalLocation}
              placeholder="Arrival Location"
              secureTextEntry // Hide the input text for passwords
            />
            {/* Show errors for Arrival Location */}
            {errors.ArrivalLocation && touched.ArrivalLocation && (
              <Text style={styles.errors}>{errors.ArrivalLocation}</Text>
            )}
            {/* Add TextInput for Departure Date */}

            <TextInput
              style={styles.textInput}
              onChangeText={handleChange('DepartureDate')}
              placeholderTextColor={'black'}
              onBlur={handleBlur('DepartureDate')}
              value={values.DepartureDate}
              placeholder="Departure Date"
              secureTextEntry // Hide the input text for passwords
            />
            {/* Show errors for Departure Date */}
            {errors.DepartureDate && touched.DepartureDate && (
              <Text style={styles.errors}>{errors.DepartureDate}</Text>
            )}
            <TextInput
              style={styles.textInput}
              onChangeText={handleChange('NoOfPassengers')}
              onBlur={handleBlur('NoOfPassengers')}
              value={values.NoOfPassengers}
              placeholder="No Of Passengers"
              placeholderTextColor={'black'}
              secureTextEntry // Hide the input text for passwords
            />
            {/* Show errors for No Of Passengers */}
            {errors.NoOfPassengers && touched.NoOfPassengers && (
              <Text style={styles.errors}>{errors.NoOfPassengers}</Text>
            )}
          </View>
          <Button
            onPress={() => {
              handleSubmit();
              validateForm();
            }}
            title="Submit"
          />
        </View>
      )}
    </Formik>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
  },
  errors: {
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
    margin: 5,
  },
  textInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    margin: 5,
    padding: 10,
  },
  leg: {
    backgroundColor: 'lightgrey',
    padding: 20,
    borderRadius: 10,
    margin: 10,
  },
});
