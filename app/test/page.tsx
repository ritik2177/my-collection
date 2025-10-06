import { Play, SkipBack, SkipForward } from "lucide-react"

import { Button } from "@mui/material"
import {
    Card, CardContent, CardHeader,
} from "@mui/material"
import Typography from "@mui/material/Typography"
// import { BorderBeam } from "@/registry/magicui/border-beam"
import { BorderBeam } from "@/components/ui/border-beam"
// Or, if you need to install a package, run: npm install magicui

export default function MusicPlayer() {
    return (
        <div className="pt-40 flex justify-center items-center">
        <Card className="relative w-[350px] overflow-hidden ">
            <CardHeader>
                <Typography variant="h5" component="div">Now Playing</Typography>
                <Typography variant="body2" color="text.secondary">Stairway to Heaven - Led Zeppelin</Typography>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center gap-4">
                    <div className="h-48 w-48 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
                    <div className="bg-secondary h-1 w-full rounded-full">
                        <div className="bg-primary h-full w-1/3 rounded-full" />
                    </div>
                    <div className="text-muted-foreground flex w-full justify-between text-sm">
                        <span>2:45</span>
                        <span>8:02</span>
                    </div>
                </div>
            </CardContent>
            <div className="flex justify-center gap-4 p-4"> {/* Replaced CardFooter with a div */}
                <Button variant="outlined" size="small" className="rounded-full">
                    <SkipBack className="size-4" />
                </Button>
                <Button variant="contained" size="medium" className="rounded-full">
                    <Play className="size-4" />
                </Button>
                <Button variant="outlined" size="small" className="rounded-full">
                    <SkipForward className="size-4" />
                </Button>
            </div>
            <BorderBeam
                duration={6}
                size={400}
                className="from-transparent via-red-500 to-transparent"
            />
            <BorderBeam
                duration={6}
                delay={3}
                size={400}
                borderWidth={2}
                className="from-transparent via-blue-500 to-transparent"
            />
        </Card>
        </div>
    )
}
