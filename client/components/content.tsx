import axios from 'axios'
import toast from 'react-hot-toast'
import { QueryClient, useMutation, useQuery } from 'react-query'
import { queryClient } from '../pages/_app'

const Content = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: 'content',
    queryFn: () => axios.get(`${process.env.NEXT_PUBLIC_API_URL}`).then(res => res.data),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24,
  })

  const deleteMutation = useMutation({
    mutationKey: 'delete',
    mutationFn: (key: string) => axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/${key}`).then(res => res.data),
    onMutate: async (key: string) => {
      await queryClient.cancelQueries('content')
      const previousValue = queryClient.getQueryData('content')
      queryClient.setQueryData('content', (old: any) => ({
        ...old,
        files: old.files.filter((item: any) => item.key !== key),
      }))
      return { previousValue }
    },
    onError: (err, key, context) => {
      queryClient.setQueryData('content', context?.previousValue)
      toast.error('Error deleting file')
    },
    onSuccess: () => {
      toast.success('File deleted successfully')
    },
    onSettled: () => {
      queryClient.invalidateQueries('content')
    },
  })

  const sizeFormatter = (size: number) => {
    if (size === -1)
      return 'Calculating...'

    if (size < 1024) {
      return `${size} B`
    }
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`
    }
    if (size < 1024 * 1024 * 1024) {
      return `${(size / 1024 / 1024).toFixed(2)} MB`
    }
    return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-5">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="bg-neutral-800 p-4 rounded-md flex flex-col gap-4 border border-neutral-700 overflow-hidden"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center w-full gap-2">
                <h1 className="font-medium text-center truncate w-[80%] h-5 rounded bg-neutral-700 animate-pulse" />
                <p className="w-[40%] h-3 rounded bg-neutral-700 animate-pulse" />
              </div>
              <div className="flex gap-1 items-center justify-center w-full">
                <button
                  className="bg-neutral-800 border border-neutral-700 text-neutral-100 px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-150 ease-in-out"
                >
                  <div className="w-[8ch] h-3 rounded bg-neutral-700" />
                </button>
                <button
                  className="text-red-500 text-neutral-100 px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-150 ease-in-out"
                >
                  <div className="w-[6ch] h-3 rounded bg-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-5">
      {data?.files.map((item: any) => (
        <div className="bg-neutral-800 p-4 rounded-md flex flex-col gap-4 border border-neutral-700 overflow-hidden">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center w-full">
              <h1
                title={item.key}
                className="font-medium text-center truncate max-w-[60%]"
              >
                {item.key}
              </h1>
              <p className="text-neutral-400 text-sm">
                {sizeFormatter(item.size)}
              </p>
            </div>
            <div className="flex gap-1 items-center justify-center w-full">
              {/*<button*/}
              {/*  className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-100 px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-150 ease-in-out"*/}
              {/*>*/}
              {/*  Download*/}
              {/*</button>*/}
              <button
                className="text-red-500 hover:text-white hover:bg-red-500 text-neutral-100 px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-150 ease-in-out"
                onClick={() => deleteMutation.mutate(item.key)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Content