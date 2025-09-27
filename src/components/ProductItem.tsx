import * as motion from "motion/react-client";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "./link";
import { productIncloudeCategory } from "@/types/product";

const ProductItem = ({
  product,
  index,
}: {
  product: productIncloudeCategory;
  index: number;
}) => {
  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link href={`/product-details/${product.id}`}>
        <Card className="group cursor-pointer overflow-hidden hover:border border-teal-400 rounded-lg hover:shadow-md transition-all duration-300 bg-card/50 py-0">
          <CardHeader className="p-0">
            <div className="relative">
              <div className="w-full h-48 relative">
                <Image
                  fill
                  src={product.image}
                  alt={product.name}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-background/80 ">
                  {product.category.name}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-3 text-start">
            <h3 className="text-lg font-serif font-bold text-foreground line-clamp-1 mb-3 group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>

            <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center text-primary font-medium group-hover:underline">
              Read more
              <ArrowRight className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ProductItem;
