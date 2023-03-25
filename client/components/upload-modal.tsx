import axios from 'axios'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { queryClient } from '../pages/_app'

const UploadModal = ({ close }: any) => {
  const [loading, setLoading] = useState(false)

  const uploadMutation = useMutation({
    mutationKey: 'upload',
    mutationFn: (file: any) => {
      const formData = new FormData()
      formData.append('file', file)
      return axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, formData).then(res => res.data)
    },
    onMutate: async (file: any) => {
      await queryClient.cancelQueries('content')
      const previousValue = queryClient.getQueryData('content')
      queryClient.setQueryData('content', (old: any) => ({
        ...old,
        files: [...old.files, { ...file, key: `Uploading ${file.name}`, size: -1 }],
      }))
      return { previousValue }
    },
    onError: (err, file, context) => {
      queryClient.setQueryData('content', context?.previousValue)
      toast.error('Error uploading file')
    },
    onSuccess: () => {
      toast.success('File uploaded successfully')
    },
    onSettled: () => {
      queryClient.invalidateQueries('content')
      setLoading(false)
    },
  })

  return (
    <motion.div
      className="bg-black/50 absolute inset-0 z-50 backdrop-blur-[2px] flex items-center justify-center"
      onClick={close}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      key="upload-modal"
    >
      <div
        className="bg-neutral-900 p-4 rounded-md flex flex-col gap-4 border border-neutral-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-lg font-light">
          Upload
        </h1>
        <FileUploader
          handleChange={(file: any) => {
            uploadMutation.mutate(file)
            close()
          }}
          multiple={false}
          label="Drag and drop files here or click to upload"
          classes="border border-neutral-700 drop rounded-md text-neutral-400"
          disabled={loading}
        />
      </div>
    </motion.div>
  )
}

export default UploadModal