import Image from "next/image"
import iconCheckImg from '../assets/icon-check.svg'

interface InfoStatsProps {
  contentNumber: number
  contentText: string
}

export default function InfoStats(props: InfoStatsProps){
  return (
    <div className='flex items-center gap-6 text-white text-base font-bold'>
      <Image src={iconCheckImg} alt='Incon check'/>
      <div className='flex flex-col gap-1'>
        <span className='text-2xl'>+{props.contentNumber}</span>
        <span>{props.contentText}</span>
      </div>
    </div>
  )
}