import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import UploadModal from './upload-modal'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <AnimatePresence mode="wait">
        {menuOpen && (
          <UploadModal key="open" close={() => setMenuOpen(false)} />
        )}
      </AnimatePresence>
      <div className="flex flex-col">
        <h1 className="font-medium">
          S3 Bucket Explorer
        </h1>
        <p className="text-neutral-400 text-sm">
          Upload, download, and delete files from S3
        </p>
      </div>
      <div>
        <button
          className="text-sm bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-100 px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-150 ease-in-out"
          onClick={() => setMenuOpen(true)}
        >
          Upload
        </button>
      </div>
    </div>
  )
}

export default Header