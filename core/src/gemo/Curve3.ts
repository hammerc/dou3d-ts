namespace dou3d {
    /**
     * 贝塞尔曲线
     * 目前定义了三种: 
     * - 线性贝塞尔曲线 (两个点形成)
     * - 二次方贝塞尔曲线 (三个点形成)
     * - 三次方贝塞尔曲线 (四个点形成)
     * @author wizardc
     */
    export class Curve3 {
        /**
         * 线性贝塞尔曲线
         */
        public static createLinearBezier(point1: Vector3, point2: Vector3, bezierPointNum: number): Curve3 {
            bezierPointNum = bezierPointNum > 2 ? bezierPointNum : 3;
            let beizerPoint: Vector3[] = [];
            let equation = (t: number, val0: number, val1: number) => {
                let res = (1 - t) * val0 + t * val1;
                return res;
            }
            beizerPoint.push(point1);
            for (let i = 1; i <= bezierPointNum; i++) {
                beizerPoint.push(new Vector3(equation(i / bezierPointNum, point1.x, point2.x), equation(i / bezierPointNum, point1.y, point1.y), equation(i / bezierPointNum, point1.z, point1.z)));
            }
            return new Curve3(beizerPoint, bezierPointNum);
        }

        /**
         * 二次方贝塞尔曲线路径
         */
        public static createQuadraticBezier(point1: Vector3, point2: Vector3, point3: Vector3, bezierPointNum: number): Curve3 {
            bezierPointNum = bezierPointNum > 2 ? bezierPointNum : 3;
            let beizerPoint: Vector3[] = [];
            let equation = (t: number, val0: number, val1: number, val2: number) => {
                let res = (1 - t) * (1 - t) * val0 + 2 * t * (1 - t) * val1 + t * t * val2;
                return res;
            }
            for (let i = 1; i <= bezierPointNum; i++) {
                beizerPoint.push(new Vector3(equation(i / bezierPointNum, point1.x, point2.x, point3.x), equation(i / bezierPointNum, point1.y, point2.y, point3.y), equation(i / bezierPointNum, point1.z, point2.z, point3.z)));
            }
            return new Curve3(beizerPoint, bezierPointNum);
        }

        /**
         * 三次方贝塞尔曲线路径
         */
        public static createCubicBezier(point1: Vector3, point2: Vector3, point3: Vector3, point4: Vector3, bezierPointNum: number): Curve3 {
            bezierPointNum = bezierPointNum > 3 ? bezierPointNum : 4;
            let beizerPoint: Vector3[] = [];
            let equation = (t: number, val0: number, val1: number, val2: number, val3: number) => {
                let res = (1 - t) * (1 - t) * (1 - t) * val0 + 3 * t * (1 - t) * (1 - t) * val1 + 3 * t * t * (1 - t) * val2 + t * t * t * val3;
                return res;
            }
            for (let i = 1; i <= bezierPointNum; i++) {
                beizerPoint.push(new Vector3(equation(i / bezierPointNum, point1.x, point2.x, point3.x, point4.x), equation(i / bezierPointNum, point1.y, point2.y, point3.y, point4.y), equation(i / bezierPointNum, point1.z, point2.z, point3.z, point4.z)));
            }
            return new Curve3(beizerPoint, bezierPointNum);
        }

        /**
         * 贝塞尔曲线上的点，不包含第一个点
         */
        public beizerPoints: Vector3[];

        /**
         * 贝塞尔曲线上所有的个数
         */
        public bezierPointNum: number;

        public constructor(beizerPoints: Vector3[], bezierPointNum: number) {
            this.beizerPoints = beizerPoints;
            this.bezierPointNum = bezierPointNum;
        }
    }
}
