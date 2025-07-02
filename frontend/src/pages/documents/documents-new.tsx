import React, { ReactElement, useState } from 'react';
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
import { SwitchField } from '../../components/SwitchField'

import { SelectField } from '../../components/SelectField'
import {RichTextField} from "../../components/RichTextField";

import { create } from '../../stores/documents/documentsSlice'
import { useAppDispatch } from '../../stores/hooks'
import { useRouter } from 'next/router'

const initialValues = {

    title: '',

    document_type: 'Checklist',

    fileurl: '',

}

const DocumentsNew = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [file, setFile] = useState<File | null>(null)


const handleSubmit = async (data) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('document_type', data.document_type);
  if (file) {
    formData.append('file', file);
  }
  await dispatch(create(formData));
  await router.push('/documents/documents-list');
}
  return (
    <>
      <Head>
        <title>{getPageTitle('New Item')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="New Item" main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            initialValues={
                initialValues
            }
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

  <FormField
      label="Title"
  >
      <Field
          name="title"
          placeholder="Title"
      />
  </FormField>

  <FormField label="DocumentType" labelFor="document_type">
      <Field name="document_type" id="document_type" component="select">

        <option value="Checklist">Checklist</option>

        <option value="Form">Form</option>

        <option value="Policy">Policy</option>

        <option value="Procedure">Procedure</option>

        <option value="Plan">Plan</option>

      </Field>
  <FormField label="File" labelFor="file">
    <input
      id="file"
      name="file"
      type="file"
      onChange={e => setFile(e.currentTarget.files ? e.currentTarget.files[0] : null)}
    />
  </FormField>

  <BaseDivider />
  </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/documents/documents-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

DocumentsNew.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default DocumentsNew
