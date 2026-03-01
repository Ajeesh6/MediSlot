import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const MyAppointments = () => {

  const { backendUrl, token, getDoctorsData} = useContext(AppContext)

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const navigate = useNavigate()

  const getUserAppointments = async () => {

    try {

      setLoading(true)
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })

      if (data.success) {
        setAppointments(data.appointments.reverse())
        // console.log(data.appointments);

      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)

    } finally {
      setLoading(false) 
    }

  }

  const cancelAppointment = async (appointmentId) => {

    try {

      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }

  }

  const initPay = (order) => {

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);

        try {

          const { data } = await axios.post(backendUrl + '/api/user/verifyRazorpay', response, { headers: { token } })
          if (data.success) {
            getUserAppointments()
            navigate('/my-appointments')
          }

        } catch (error) {
          console.log(error);
          toast.error(error.message)
        }

      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()

  }

  const appointmentRazorpay = async (appointmentId) => {

    try {

      const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })

      if (data.success) {
        initPay(data.order)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      <div>
        {
          loading ? (
            [...Array(4)].map((_, index) => (
              <div
                key={index}
                className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b animate-pulse'
              >
                {/* Image */}
                <div>
                  <div className='w-32 h-32 bg-gray-200 rounded'></div>
                </div>

                {/* Info */}
                <div className='flex-1 space-y-3'>
                  <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                  <div className='h-3 bg-gray-200 rounded w-1/4'></div>

                  <div className='h-3 bg-gray-200 rounded w-1/5 mt-2'></div>
                  <div className='h-3 bg-gray-200 rounded w-2/3'></div>
                  <div className='h-3 bg-gray-200 rounded w-1/2'></div>

                </div>

                {/* Buttons */}
                <div className='flex flex-col gap-2 justify-end'>
                  <div className='h-8 bg-gray-200 rounded w-32'></div>
                  <div className='h-8 bg-gray-200 rounded w-32'></div>
                </div>
              </div>
            ))
          ) :
            appointments.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p className="text-lg font-medium">No appointments yet</p>
                <p className="text-sm mt-2">
                  Book your first appointment to get started
                </p>
                <button
                  onClick={() => navigate('/doctors')}
                  className="mt-4 px-5 py-2 bg-primary text-white rounded-full">
                  Book Appointment
                </button>
              </div>
            ) : (
              appointments.map((item, index) => (
                <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
                  <div>
                    <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
                  </div>
                  <div className='flex-1 text-sm text-zinc-600'>
                    <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                    <p>{item.docData.speciality}</p>
                    <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                    <p className='text-xs'>{item.docData.address.line1}</p>
                    <p className='text-xs'>{item.docData.address.line2}</p>
                    <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime} </p>
                  </div>
                  <div></div>
                  <div className='flex flex-col gap-2 justify-end'>
                    {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button>}
                    {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={() => appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay online</button>}
                    {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
                    {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>}
                    {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>}
                  </div>
                </div>
              ))
            )}
      </div>
    </div>
  )
}

export default MyAppointments