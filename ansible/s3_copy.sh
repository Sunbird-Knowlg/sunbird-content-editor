#!/bin/sh
AWS_CONFIG_FILE="~/.aws/config"

aws s3 --region $1 rm $2/org.ekstep.assessment-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.assessmentbrowser-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.assetbrowser-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.atpreview-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.colorpicker-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.conceptselector-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.config-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.copypaste-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.delete-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.hollowcircle-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.hotspot-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.htext-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.image-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.quiz-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.reorder-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.scribblepad-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.shape-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.stage-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.stageconfig-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.stagedecorator-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.templatebrowser-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.text-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.todo-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.unsupported-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.viewecml-1.0/ --recursive
aws s3 --region $1 rm $2/org.ekstep.wordbrowser-1.0/ --recursive

aws s3 --region $1 cp content-plugins $2/ --recursive --acl public-read
