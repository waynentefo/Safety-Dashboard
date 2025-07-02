import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/inspections/inspectionsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditInspections = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'inspection_type': '',

    conducted_by: null,

    inspection_date: new Date(),

    remarks: '',

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { inspections } = useAppSelector((state) => state.inspections)

  const { inspectionsId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: inspectionsId }))
  }, [inspectionsId])

  useEffect(() => {
    if (typeof inspections === 'object') {
      setInitialValues(inspections)
    }
  }, [inspections])

  useEffect(() => {
      if (typeof inspections === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (inspections)[el])

          setInitialValues(newInitialVal);
      }
  }, [inspections])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: inspectionsId, data }))
    await router.push('/inspections/inspections-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit inspections')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit inspections'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField
        label="InspectionType"
    >
        <Field
            name="inspection_type"
            placeholder="InspectionType"
        />
    </FormField>

    <FormField label='ConductedBy' labelFor='conducted_by'>
        <Field
            name='conducted_by'
            id='conducted_by'
            component={SelectField}
            options={initialValues.conducted_by}
            itemRef={'users'}

            showField={'firstName'}

        ></Field>
    </FormField>

      <FormField
          label="InspectionDate"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.inspection_date ?
                  new Date(
                      dayjs(initialValues.inspection_date).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'inspection_date': date})}
          />
      </FormField>

    <FormField label="Remarks" hasTextareaHeight>
        <Field name="remarks" as="textarea" placeholder="Remarks" />
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/inspections/inspections-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditInspections.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditInspections
