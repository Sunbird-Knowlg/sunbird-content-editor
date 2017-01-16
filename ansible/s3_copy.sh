#!/bin/sh
AWS_CONFIG_FILE="~/.aws/config"

aws s3 --region ap-south-1 rm $1/org.ekstep.assessment-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.assessmentbrowser-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.assetbrowser-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.atpreview-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.colorpicker-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.conceptselector-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.config-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.copypaste-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.delete-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.hollowcircle-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.hotspot-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.htext-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.image-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.quiz-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.reorder-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.scribblepad-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.shape-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.stage-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.stageconfig-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.stagedecorator-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.templatebrowser-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.text-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.todo-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.unsupported-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.viewecml-1.0/ --recursive
aws s3 --region ap-south-1 rm $1/org.ekstep.wordbrowser-1.0/ --recursive

aws s3 --region ap-south-1 cp content-plugins $1/ --recursive --acl public-read
