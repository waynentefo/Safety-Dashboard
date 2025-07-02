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

import { update, fetch } from '../../stores/audits/auditsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditAudits = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'audit_title': '',

    auditor: null,

    audit_date: new Date(),

    findings: '',

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { audits } = useAppSelector((state) => state.audits)

  const { auditsId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: auditsId }))
  }, [auditsId])

  useEffect(() => {
    if (typeof audits === 'object') {
      setInitialValues(audits)
    }
  }, [audits])

  useEffect(() => {
      if (typeof audits === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (audits)[el])

          setInitialValues(newInitialVal);
      }
  }, [audits])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: auditsId, data }))
    await router.push('/audits/audits-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit audits')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit audits'} main>
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
        label="AuditTitle"
    >
        <Field
            name="audit_title"
            placeholder="AuditTitle"
        />
    </FormField>

    <FormField label='Auditor' labelFor='auditor'>
        <Field
            name='auditor'
            id='auditor'
            component={SelectField}
            options={initialValues.auditor}
            itemRef={'users'}

            showField={'firstName'}

        ></Field>
    </FormField>

      <FormField
          label="AuditDate"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.audit_date ?
                  new Date(
                      dayjs(initialValues.audit_date).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'audit_date': date})}
          />
      </FormField>

    <FormField label="Findings" hasTextareaHeight>
        <Field name="findings" as="textarea" placeholder="Findings" />
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/audits/audits-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditAudits.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditAudits
