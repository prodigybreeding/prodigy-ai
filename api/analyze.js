export default async function handler(req, res) {
 
if (req.method !== "POST") {
return res.status(405).json({
error: "Method not allowed"
});
}
 
try {
 
const { image } = req.body;
 
const response = await fetch(
"https://api.openai.com/v1/chat/completions",
{
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
},
body: JSON.stringify({
model: "gpt-4o",
messages: [
{
role: "system",
content: `
You are an expert Western Hognose Snake breeder.
 
Identify ONLY visible morph traits.
 
Never infer:
- het
- poss het
- hidden genes
 
Return exactly:
 
Species:
Morph:
Confidence:
Visible Traits:
Similar Morphs:
`
},
{
role: "user",
content: [
{
type: "text",
text: "Identify this Hognose morph."
},
{
type: "image_url",
image_url: {
url: image
}
}
]
}
],
max_tokens: 300
})
}
);
 
const data = await response.json();
 
if (!response.ok) {
return res.status(500).json(data);
}
 
return res.status(200).json({
result: data.choices[0].message.content
});
 
} catch (error) {
 
return res.status(500).json({
error: error.message
});
 
}
 
}
