import { FC, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { IoIosShareAlt } from 'react-icons/io';
import { FiCopy } from 'react-icons/fi';
import { AiOutlineMail } from 'react-icons/ai';
import { FaWhatsapp } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import Tooltip from './toolbar/Tooltip';

const ShareBtns: FC = () => {
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  const shareOnWhatsApp = () => {
    const link = window.location.href;
    const message = `Check this out: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareViaGmail = () => {
    const link = window.location.href;
    const subject = 'Check this out!';
    const body = `Here's something interesting: ${link}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  };

  const shareViaEmail = () => {
    const link = window.location.href;
    const subject = 'Check this out!';
    const body = `Here's something interesting: ${link}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  return (
    <>
      <Tooltip title="Share">
        <button
          className="w-8 h-8 flex justify-center items-center hover:bg-[#3C3C3C] rounded-full"
          onClick={() => setOpen(true)}
        >
          <IoIosShareAlt />
        </button>
      </Tooltip>
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        <div className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden">
          <DialogPanel
            className="relative transform bg-white dark:bg-gray-800 w-full sm:w-96 rounded-lg shadow-lg transition-all sm:m-4"
            style={{ animation: 'fade-in 0.3s ease-out' }}
          >
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              onClick={() => setOpen(false)}
            >
              <IoClose size={24} />
            </button>

            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Share this canvas.
              </h3>
              <div className="mt-5 grid grid-cols-3 gap-4">
                {/* WhatsApp Button */}
                <button
                  onClick={shareOnWhatsApp}
                  className="flex flex-col items-center p-2 text-white rounded-lg bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 shadow-md"
                >
                  <FaWhatsapp size={24} />
                  <span className="text-sm">WhatsApp</span>
                </button>

                {/* Email Button */}
                <button
                  onClick={shareViaGmail}
                  className="flex flex-col items-center p-2 text-white rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 shadow-md"
                >
                  <AiOutlineMail size={24} />
                  <span className="text-sm">Gmail</span>
                </button>

                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className="flex flex-col items-center p-2 text-white rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 shadow-md"
                >
                  <FiCopy size={24} />
                  <span className="text-sm">Copy</span>
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default ShareBtns;
