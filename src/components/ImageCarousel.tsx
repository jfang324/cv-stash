'use client'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'

interface ImageCarouselProps {
    images: string[]
}

export const ImageCarousel = ({ images }: ImageCarouselProps) => {
    return (
        <Carousel
            orientation="horizontal"
            opts={{ loop: true }}
            plugins={[
                Autoplay({
                    delay: 4000,
                }),
            ]}
        >
            <CarouselContent>
                {images.map((image) => (
                    <CarouselItem key={image}>
                        <Image
                            src={image}
                            alt={image}
                            className="rounded-md mx-auto border border-black"
                            height={400}
                            width={700}
                            quality={100}
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
