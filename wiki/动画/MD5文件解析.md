
# 理解骨骼动画的数据存储

3D模型及动画文件格式非常之多，除了常用的格式外，也有许多满足自己需要的自定义格式。

大部分采用解码快速的二进制格式，不方便查看，我们这里选择存文本的MD5格式来解析，可以更直观的了解骨骼动画需要的数据结构。

## 模型文件（md5mesh）

### 文件头

MD5Version \<integer\>

* MD5Version - 一个整数，定义了md5的版本号，这个地方始终写10。

commandline ”\<string\>”

* commandline - 一个字符串，是要传递个exportmodels命令控制台的参数。

### 具体参数

numJoints \<integer\>

* numJoints - 一个整数，该模型的骨骼数量。

numMeshes \<integer\>

* numMeshes - 一个整数，该模型的网格数。

### 列表

\<string\> {

        [element 1]

        [element 2]

        [element 3]

        … ect …

}

格式：

1. 首先，声明列表类型（\<string\>）。然后在大括号中包含具体内容。

2. 内容每一行为一系列元素,用\r\n进行分割。

3. MD5MESH中有两个组：Joints和Mesh。

#### Joints（骨骼）

“[boneName]“   [parentIndex] ( [xPos] [yPos] [zPos] ) ( [xOrient] [yOrient] [zOrient] )

* boneName - 骨骼的名称。

* parentIndex - 骨骼父节点的序号。

* xPos - 位置x坐标。

* yPos - 位置y坐标。

* zPos - 位置z坐标。

* xOrient - 骨骼绕x轴方向（四元数格式）。

* yOrient - 骨骼绕y轴方向（四元数格式）。

* zOrient - 骨骼绕z轴方向（四元数格式）。

#### Mesh（模型及蒙皮）

// meshes: [meshName]

* meshName - 网格的名称，一个md5mesh文件可以包含有多个模型，对应到引擎中为一个Mesh对象的Geometry下面的SubGeometry对象。

shader ”[materialName]“

* materialName -  这个网格的材质。

##### Vert

numverts \<integer\>

* numverts - 顶点的数量。

vert [vertIndex] ( [texU] [texV] ) [weightIndex] [weightElem]

* vertIndex - 这个顶点的索引。

* texU - UV纹理坐标U分量。

* texV - UV纹理坐标V分量。

* weightIndex - 这个顶点在权重列表中的第一个权重的索引。

* weightElem -  这个顶点在权重列表中受影响的权重数量。

##### Tri

numtris \<integer\>

* numtris - 三角形的数量。

tri [triIndex] [vertIndex1] [vertIndex2] [vertIndex3]

* triIndex - 这个三角形的索引。

* vertIndex1 - 这个三角形的第一个顶点索引。

* vertIndex2 - 这个三角形的第二个顶点索引。

* vertIndex3 - 这个三角形的第三个顶点索引。

##### Weight

numweights \<integer\>

* numweights - 权重的数量。

weight [weightIndex] [jointIndex] [weightValue] ( [xPos] [yPos] [zPos] )

* weightIndex - 这个权重的索引。

* jointIndex - 权重关联的骨骼。

* weightValue - 权重值。

* xPos -权重平移元素的x分量。

* yPos - 权重平移元素的y分量。

* zPos - 权重平移元素的z分量。

## 动画文件（md5anim）

### 文件头

MD5Version \<integer\>

* MD5Version - 一个整数，定义了md5的版本号，这个地方始终写10。

commandline ”\<string\>”

* commandline - 一个字符串，是要传递个exportmodels命令控制台的参数。

### 具体参数

numFrames \<integer\>

* numFrames - 动画帧数.

numJoints \<integer\>

* numJoints - 骨骼数量

frameRate \<integer\>

* frameRate - 帧频

numAnimatedComponents \<integer\>

* numAnimatedComponents - 动画元素数量

### 列表

\<string\> {

        [element 1]

        [element 2]

        [element 3]

        … ect …

}

格式：

1. 首先，声明列表类型（\<string\>）。然后在大括号中包含具体内容。

2. 内容每一行为一系列元素,用\r\n进行分割。

#### Hierarchy

“[boneName]“   [parentIndex] [numComp] [frameIndex] // [parentName] ( [tX] [tY] [tZ] [qX] [qY] [qZ] )

* boneName -骨骼名称

* parentIndex - 骨骼父节点索引.

* numComp - 变化的flags

* frameIndex - 变化数据在帧中的索引

//以下为可选参数

* parentName - The name of the parent bone

* [tX] - Optional placeholder just to provide a visual of what components are animated

* [tY] - Optional placeholder just to provide a visual of what components are animated

* [tZ] - Optional placeholder just to provide a visual of what components are animated

* [qX] - Optional placeholder just to provide a visual of what components are animated

* [qY] - Optional placeholder just to provide a visual of what components are animated

* [qZ] - Optional placeholder just to provide a visual of what components are animated

#### Bounds

* ( [minX] [minY] [minZ] ) ( [maxX] [maxY] [maxZ] )

* minX - The X component of the frames’s minimum bounding box XYZ position.

* minY - The Y component of the frames’s minimum bounding box XYZ position.

* minZ - The Z component of the frames’s minimum bounding box XYZ position.

* maxX - The X component of the frames’s maximum bounding box XYZ position.

* maxY - The Y component of the frames’s maximum bounding box XYZ position.

* maxZ - The Z component of the frames’s maximum bounding box XYZ position.

#### Baseframe

( [xPos] [yPos] [zPos] ) ( [xOrient] [yOrient] [zOrient] )

第一个origin一般为mesh坐标系中mesh初始位置

第二个body一般表示整体（位移，旋转）

* xPos - 骨骼相对于父骨骼的平移元素的x分量。

* yPos - 骨骼相对于父骨骼的平移元素的y分量。

* zPos - 骨骼相对于父骨骼的平移元素的z分量。

* xOrient - 骨骼旋转元素的x分量（四元数格式）。

* yOrient - 骨骼旋转元素的y分量（四元数格式）。

* zOrient - 骨骼旋转元素的z分量（四元数格式）。

#### Frame 0,1,2, ect…

[xPos] [yPos] [zPos] [xOrient] [yOrient] [zOrient]

* xPos - 节点 相对于父节点的平移元素的x分量。

* yPos - 节点 相对于父节点的平移元素的y分量。

* zPos - 节点 相对于父节点的平移元素的z分量。

* xOrient - 骨骼旋转元素的x分量（四元数格式）。

* yOrient - 骨骼旋转元素的y分量（四元数格式）。

* zOrient - 骨骼旋转元素的z分量（四元数格式）。
